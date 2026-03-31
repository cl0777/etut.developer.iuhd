import type { RequestUser } from '../auth/strategies/jwt.strategy';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(user: RequestUser): RequestUser;
    myCourses(user: RequestUser): import(".prisma/client").Prisma.PrismaPromise<({
        course: {
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
        };
    } & {
        userId: string;
        courseId: string;
        enrolledAt: Date;
    })[]>;
}
