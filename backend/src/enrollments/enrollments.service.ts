import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course || !course.published) {
      throw new NotFoundException('Course not found');
    }
    try {
      return await this.prisma.enrollment.create({
        data: { userId, courseId },
        include: { course: true },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Already enrolled');
      }
      throw e;
    }
  }

  async unenroll(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    await this.prisma.enrollment.delete({
      where: { userId_courseId: { userId, courseId } },
    });
    return { ok: true };
  }

  async adminEnrollUser(
    courseId: string,
    payload: { userId?: string; email?: string },
  ) {
    if (!payload.userId && !payload.email) {
      throw new BadRequestException('Provide userId or email');
    }
    const user = payload.userId
      ? await this.prisma.user.findUnique({ where: { id: payload.userId } })
      : await this.prisma.user.findUnique({
          where: { email: payload.email?.toLowerCase() },
        });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    try {
      return await this.prisma.enrollment.create({
        data: { userId: user.id, courseId },
        include: { course: true, user: { select: { id: true, email: true } } },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('User already enrolled');
      }
      throw e;
    }
  }

  async listCourseEnrollments(
    courseId: string,
    params?: { search?: string; page?: number; pageSize?: number },
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const page = Math.max(1, params?.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params?.pageSize ?? 10));
    const search = params?.search?.trim();
    const where: Prisma.EnrollmentWhereInput = {
      courseId,
      ...(search
        ? {
            user: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
    };
    const [total, items] = await this.prisma.$transaction([
      this.prisma.enrollment.count({ where }),
      this.prisma.enrollment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
        orderBy: { enrolledAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return { items, total, page, pageSize };
  }
}
