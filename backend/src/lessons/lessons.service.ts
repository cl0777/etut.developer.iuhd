import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { unlink } from 'node:fs/promises';
import { extname } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly blockedCodeExtensions = new Set([
    '.js',
    '.mjs',
    '.cjs',
    '.ts',
    '.tsx',
    '.jsx',
    '.php',
    '.py',
    '.java',
    '.rb',
    '.go',
    '.cpp',
    '.c',
    '.cs',
    '.sh',
    '.sql',
    '.html',
    '.css',
    '.json',
    '.xml',
    '.yaml',
    '.yml',
  ]);

  private readonly allowedMaterialExtensions = new Set([
    '.zip',
    '.rar',
    '.7z',
    '.pdf',
    '.ppt',
    '.pptx',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.txt',
  ]);

  private readonly allowedVideoExtensions = new Set([
    '.mp4',
    '.mov',
    '.avi',
    '.mkv',
    '.webm',
  ]);

  async create(courseId: string, dto: CreateLessonDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found');
    const maxOrder = await this.prisma.lesson.aggregate({
      where: { courseId },
      _max: { order: true },
    });
    const order = dto.order ?? (maxOrder._max.order ?? -1) + 1;
    return this.prisma.lesson.create({
      data: {
        courseId,
        title: dto.title,
        description: dto.description ?? null,
        order,
        contentType: dto.contentType,
        body: dto.body ?? null,
        contentUrl: dto.contentUrl ?? null,
      },
    });
  }

  async findOne(id: string, viewer?: { id: string; role: UserRole }) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    const course = lesson.course;
    const canAccess = await this.canAccessCourse(course.id, viewer, {
      published: course.published,
      isPrivate: course.isPrivate,
    });
    if (!canAccess) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  async uploadAsset(lessonId: string, filePath: string, originalName: string) {
    const lesson = await this.ensureLesson(lessonId);
    const ext = extname(originalName).toLowerCase();
    const isCode = this.blockedCodeExtensions.has(ext);
    const isVideo = this.allowedVideoExtensions.has(ext);
    const isMaterial = this.allowedMaterialExtensions.has(ext);
    if (isCode || (!isVideo && !isMaterial)) {
      await unlink(filePath).catch(() => undefined);
      throw new BadRequestException(
        'Unsupported file type. Allowed: videos and course materials only.',
      );
    }
    const contentType = isVideo ? 'VIDEO' : 'FILE';
    const relativePath = filePath.split('/uploads/')[1] ?? '';
    const contentUrl = `/uploads/${relativePath}`;
    return this.prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        contentType,
        contentUrl,
      },
    });
  }

  async update(id: string, dto: UpdateLessonDto) {
    await this.ensureLesson(id);
    return this.prisma.lesson.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.ensureLesson(id);
    await this.prisma.lesson.delete({ where: { id } });
    return { ok: true };
  }

  private async ensureLesson(id: string) {
    const l = await this.prisma.lesson.findUnique({ where: { id } });
    if (!l) throw new NotFoundException('Lesson not found');
    return l;
  }

  private async canAccessCourse(
    courseId: string,
    viewer?: { id: string; role: UserRole },
    courseSnapshot?: { published: boolean; isPrivate: boolean },
  ) {
    const snapshot =
      courseSnapshot ??
      (await this.prisma.course.findUnique({
        where: { id: courseId },
        select: { published: true, isPrivate: true },
      }));
    if (!snapshot) return false;
    if (snapshot.published && !snapshot.isPrivate) return true;
    if (!viewer) return false;
    if (viewer.role === UserRole.ADMIN || viewer.role === UserRole.TEACHER) {
      return true;
    }
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: viewer.id, courseId },
      },
    });
    return Boolean(enrollment);
  }
}
