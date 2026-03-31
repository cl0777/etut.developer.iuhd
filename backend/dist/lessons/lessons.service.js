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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const prisma_service_1 = require("../prisma/prisma.service");
let LessonsService = class LessonsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.blockedCodeExtensions = new Set([
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
        this.allowedMaterialExtensions = new Set([
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
        this.allowedVideoExtensions = new Set([
            '.mp4',
            '.mov',
            '.avi',
            '.mkv',
            '.webm',
        ]);
    }
    async create(courseId, dto) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
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
    async findOne(id, viewer) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: { course: true },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found');
        const course = lesson.course;
        const canAccess = await this.canAccessCourse(course.id, viewer, {
            published: course.published,
            isPrivate: course.isPrivate,
        });
        if (!canAccess) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        return lesson;
    }
    async uploadAsset(lessonId, filePath, originalName) {
        const lesson = await this.ensureLesson(lessonId);
        const ext = (0, node_path_1.extname)(originalName).toLowerCase();
        const isCode = this.blockedCodeExtensions.has(ext);
        const isVideo = this.allowedVideoExtensions.has(ext);
        const isMaterial = this.allowedMaterialExtensions.has(ext);
        if (isCode || (!isVideo && !isMaterial)) {
            await (0, promises_1.unlink)(filePath).catch(() => undefined);
            throw new common_1.BadRequestException('Unsupported file type. Allowed: videos and course materials only.');
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
    async update(id, dto) {
        await this.ensureLesson(id);
        return this.prisma.lesson.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.ensureLesson(id);
        await this.prisma.lesson.delete({ where: { id } });
        return { ok: true };
    }
    async ensureLesson(id) {
        const l = await this.prisma.lesson.findUnique({ where: { id } });
        if (!l)
            throw new common_1.NotFoundException('Lesson not found');
        return l;
    }
    async canAccessCourse(courseId, viewer, courseSnapshot) {
        const snapshot = courseSnapshot ??
            (await this.prisma.course.findUnique({
                where: { id: courseId },
                select: { published: true, isPrivate: true },
            }));
        if (!snapshot)
            return false;
        if (snapshot.published && !snapshot.isPrivate)
            return true;
        if (!viewer)
            return false;
        if (viewer.role === client_1.UserRole.ADMIN || viewer.role === client_1.UserRole.TEACHER) {
            return true;
        }
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId: viewer.id, courseId },
            },
        });
        return Boolean(enrollment);
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map