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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
function slugify(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPublished(query, viewer) {
        const andFilters = [];
        if (query.q) {
            andFilters.push({
                OR: [
                    { title: { contains: query.q, mode: 'insensitive' } },
                    { description: { contains: query.q, mode: 'insensitive' } },
                ],
            });
        }
        if (query.category) {
            andFilters.push({
                category: { equals: query.category, mode: 'insensitive' },
            });
        }
        if (query.tag) {
            andFilters.push({ tags: { has: query.tag } });
        }
        const visibilityFilter = viewer
            ? {
                OR: [
                    { isPrivate: false },
                    { enrollments: { some: { userId: viewer.id } } },
                ],
            }
            : { isPrivate: false };
        const where = {
            published: true,
            AND: [visibilityFilter, ...andFilters],
        };
        return this.prisma.course.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: { select: { lessons: true } },
            },
        });
    }
    async findAllAdmin() {
        return this.prisma.course.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: { select: { lessons: true, enrollments: true } },
            },
        });
    }
    async findOnePublic(id, viewer) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                lessons: { orderBy: { order: 'asc' } },
                _count: { select: { lessons: true } },
            },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (!course.published || course.isPrivate) {
            const allowed = viewer?.role === client_1.UserRole.ADMIN ||
                viewer?.role === client_1.UserRole.TEACHER ||
                (viewer &&
                    (await this.prisma.enrollment.findUnique({
                        where: {
                            userId_courseId: { userId: viewer.id, courseId: id },
                        },
                    })));
            if (!allowed) {
                throw new common_1.NotFoundException('Course not found');
            }
        }
        return course;
    }
    async create(dto) {
        let base = slugify(dto.title);
        if (!base)
            base = 'course';
        let slug = base;
        let n = 0;
        while (await this.prisma.course.findUnique({ where: { slug } })) {
            n += 1;
            slug = `${base}-${n}`;
        }
        return this.prisma.course.create({
            data: {
                title: dto.title,
                slug,
                description: dto.description,
                category: dto.category ?? null,
                tags: dto.tags ?? [],
                published: dto.published ?? false,
                isPrivate: dto.isPrivate ?? false,
            },
        });
    }
    async update(id, dto) {
        await this.ensureCourse(id);
        let slug;
        if (dto.title) {
            let base = slugify(dto.title);
            if (!base)
                base = 'course';
            slug = base;
            let n = 0;
            while (true) {
                const clash = await this.prisma.course.findFirst({
                    where: { slug, NOT: { id } },
                });
                if (!clash)
                    break;
                n += 1;
                slug = `${base}-${n}`;
            }
        }
        return this.prisma.course.update({
            where: { id },
            data: {
                ...dto,
                ...(slug !== undefined && { slug }),
            },
        });
    }
    async remove(id) {
        await this.ensureCourse(id);
        await this.prisma.course.delete({ where: { id } });
        return { ok: true };
    }
    async ensureCourse(id) {
        const c = await this.prisma.course.findUnique({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException('Course not found');
        return c;
    }
    async lessonsForCourse(courseId, viewer) {
        await this.findOnePublic(courseId, viewer);
        return this.prisma.lesson.findMany({
            where: { courseId },
            orderBy: { order: 'asc' },
        });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map