import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly blockedCodeExtensions;
    private readonly allowedMaterialExtensions;
    private readonly allowedVideoExtensions;
    create(courseId: string, dto: CreateLessonDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        order: number;
        courseId: string;
        contentType: import(".prisma/client").$Enums.LessonContentType;
        body: string | null;
        contentUrl: string | null;
    }>;
    findOne(id: string, viewer?: {
        id: string;
        role: UserRole;
    }): Promise<{
        course: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            category: string | null;
            tags: string[];
            published: boolean;
            isPrivate: boolean;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        order: number;
        courseId: string;
        contentType: import(".prisma/client").$Enums.LessonContentType;
        body: string | null;
        contentUrl: string | null;
    }>;
    uploadAsset(lessonId: string, filePath: string, originalName: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        order: number;
        courseId: string;
        contentType: import(".prisma/client").$Enums.LessonContentType;
        body: string | null;
        contentUrl: string | null;
    }>;
    update(id: string, dto: UpdateLessonDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        order: number;
        courseId: string;
        contentType: import(".prisma/client").$Enums.LessonContentType;
        body: string | null;
        contentUrl: string | null;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
    private ensureLesson;
    private canAccessCourse;
}
