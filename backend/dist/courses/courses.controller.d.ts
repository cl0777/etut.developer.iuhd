import type { RequestUser } from '../auth/strategies/jwt.strategy';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    listPublished(query: QueryCoursesDto, user?: RequestUser): Promise<({
        _count: {
            lessons: number;
        };
    } & {
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
    })[]>;
    listAdmin(): Promise<({
        _count: {
            enrollments: number;
            lessons: number;
        };
    } & {
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
    })[]>;
    getOne(id: string, user?: RequestUser): Promise<{
        _count: {
            lessons: number;
        };
        lessons: {
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
        }[];
    } & {
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
    }>;
    lessons(id: string, user?: RequestUser): Promise<{
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
    }[]>;
    create(dto: CreateCourseDto): Promise<{
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
    }>;
    update(id: string, dto: UpdateCourseDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
