import { PrismaService } from '../prisma/prisma.service';
export declare class EnrollmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    enroll(userId: string, courseId: string): Promise<{
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
        userId: string;
        courseId: string;
        enrolledAt: Date;
    }>;
    unenroll(userId: string, courseId: string): Promise<{
        ok: boolean;
    }>;
    adminEnrollUser(courseId: string, payload: {
        userId?: string;
        email?: string;
    }): Promise<{
        user: {
            email: string;
            id: string;
        };
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
        userId: string;
        courseId: string;
        enrolledAt: Date;
    }>;
    listCourseEnrollments(courseId: string, params?: {
        search?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: ({
            user: {
                email: string;
                name: string;
                id: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            userId: string;
            courseId: string;
            enrolledAt: Date;
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
}
