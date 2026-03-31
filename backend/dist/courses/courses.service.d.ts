import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findPublished(query: QueryCoursesDto, viewer?: {
        id: string;
        role: UserRole;
    }): Promise<({
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
    findAllAdmin(): Promise<({
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
    findOnePublic(id: string, viewer?: {
        id: string;
        role: UserRole;
    }): Promise<{
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
    private ensureCourse;
    lessonsForCourse(courseId: string, viewer?: {
        id: string;
        role: UserRole;
    }): Promise<{
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
}
