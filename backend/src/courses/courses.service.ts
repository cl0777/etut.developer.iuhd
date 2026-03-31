import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublished(
    query: QueryCoursesDto,
    viewer?: { id: string; role: UserRole },
  ) {
    const andFilters: Prisma.CourseWhereInput[] = [];
    if (query.q) {
      andFilters.push({
        OR: [
          { title: { contains: query.q, mode: 'insensitive' } },
          { description: { contains: query.q, mode: 'insensitive' } },
        ],
      });
    }
    if (query.category) {
      andFilters.push({
        category: { equals: query.category, mode: 'insensitive' },
      });
    }
    if (query.tag) {
      andFilters.push({ tags: { has: query.tag } });
    }
    const visibilityFilter: Prisma.CourseWhereInput = viewer
      ? {
          OR: [
            { isPrivate: false },
            { enrollments: { some: { userId: viewer.id } } },
          ],
        }
      : { isPrivate: false };
    const where: Prisma.CourseWhereInput = {
      published: true,
      AND: [visibilityFilter, ...andFilters],
    };
    return this.prisma.course.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { lessons: true } },
      },
    });
  }

  async findAllAdmin() {
    return this.prisma.course.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { lessons: true, enrollments: true } },
      },
    });
  }

  async findOnePublic(id: string, viewer?: { id: string; role: UserRole }) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: { orderBy: { order: 'asc' } },
        _count: { select: { lessons: true } },
      },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (!course.published || course.isPrivate) {
      const allowed =
        viewer?.role === UserRole.ADMIN ||
        viewer?.role === UserRole.TEACHER ||
        (viewer &&
          (await this.prisma.enrollment.findUnique({
            where: {
              userId_courseId: { userId: viewer.id, courseId: id },
            },
          })));
      if (!allowed) {
        throw new NotFoundException('Course not found');
      }
    }
    return course;
  }

  async create(dto: CreateCourseDto) {
    let base = slugify(dto.title);
    if (!base) base = 'course';
    let slug = base;
    let n = 0;
    while (await this.prisma.course.findUnique({ where: { slug } })) {
      n += 1;
      slug = `${base}-${n}`;
    }
    return this.prisma.course.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        category: dto.category ?? null,
        tags: dto.tags ?? [],
        published: dto.published ?? false,
        isPrivate: dto.isPrivate ?? false,
      },
    });
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.ensureCourse(id);
    let slug: string | undefined;
    if (dto.title) {
      let base = slugify(dto.title);
      if (!base) base = 'course';
      slug = base;
      let n = 0;
      while (true) {
        const clash = await this.prisma.course.findFirst({
          where: { slug, NOT: { id } },
        });
        if (!clash) break;
        n += 1;
        slug = `${base}-${n}`;
      }
    }
    return this.prisma.course.update({
      where: { id },
      data: {
        ...dto,
        ...(slug !== undefined && { slug }),
      },
    });
  }

  async remove(id: string) {
    await this.ensureCourse(id);
    await this.prisma.course.delete({ where: { id } });
    return { ok: true };
  }

  private async ensureCourse(id: string) {
    const c = await this.prisma.course.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Course not found');
    return c;
  }

  async lessonsForCourse(
    courseId: string,
    viewer?: { id: string; role: UserRole },
  ) {
    await this.findOnePublic(courseId, viewer);
    return this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }
}
