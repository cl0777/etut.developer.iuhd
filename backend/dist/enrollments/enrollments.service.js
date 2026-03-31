"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let EnrollmentsService = class EnrollmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async enroll(userId, courseId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course || !course.published) {
            throw new common_1.NotFoundException('Course not found');
        }
        try {
            return await this.prisma.enrollment.create({
                data: { userId, courseId },
                include: { course: true },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2002') {
                throw new common_1.ConflictException('Already enrolled');
            }
            throw e;
        }
    }
    async unenroll(userId, courseId) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        await this.prisma.enrollment.delete({
            where: { userId_courseId: { userId, courseId } },
        });
        return { ok: true };
    }
    async adminEnrollUser(courseId, payload) {
        if (!payload.userId && !payload.email) {
            throw new common_1.BadRequestException('Provide userId or email');
        }
        const user = payload.userId
            ? await this.prisma.user.findUnique({ where: { id: payload.userId } })
            : await this.prisma.user.findUnique({
                where: { email: payload.email?.toLowerCase() },
            });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        try {
            return await this.prisma.enrollment.create({
                data: { userId: user.id, courseId },
                include: { course: true, user: { select: { id: true, email: true } } },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2002') {
                throw new common_1.ConflictException('User already enrolled');
            }
            throw e;
        }
    }
    async listCourseEnrollments(courseId, params) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const page = Math.max(1, params?.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, params?.pageSize ?? 10));
        const search = params?.search?.trim();
        const where = {
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
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map