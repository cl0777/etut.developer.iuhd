import type { RequestUser } from '../auth/strategies/jwt.strategy';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
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
    getOne(id: string, user?: RequestUser): Promise<{
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
    uploadAsset(id: string, file?: Express.Multer.File): Promise<{
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
}
