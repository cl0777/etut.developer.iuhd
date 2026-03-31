import type { RequestUser } from '../auth/strategies/jwt.strategy';
import { AdminEnrollUserDto } from './dto/admin-enroll-user.dto';
import { EnrollmentsService } from './enrollments.service';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enroll(courseId: string, user: RequestUser): Promise<{
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
    unenroll(courseId: string, user: RequestUser): Promise<{
        ok: boolean;
    }>;
    enrollUserAsAdmin(courseId: string, dto: AdminEnrollUserDto): Promise<{
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
    listEnrollments(courseId: string, search?: string, page?: string, pageSize?: string): Promise<{
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
