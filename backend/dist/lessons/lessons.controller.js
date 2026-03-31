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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const node_fs_1 = require("node:fs");
const multer_1 = require("multer");
const node_path_1 = require("node:path");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
const staff_guard_1 = require("../auth/guards/staff.guard");
const create_lesson_dto_1 = require("./dto/create-lesson.dto");
const update_lesson_dto_1 = require("./dto/update-lesson.dto");
const lessons_service_1 = require("./lessons.service");
let LessonsController = class LessonsController {
    constructor(lessonsService) {
        this.lessonsService = lessonsService;
    }
    create(courseId, dto) {
        return this.lessonsService.create(courseId, dto);
    }
    getOne(id, user) {
        const viewer = user ? { id: user.id, role: user.role } : undefined;
        return this.lessonsService.findOne(id, viewer);
    }
    update(id, dto) {
        return this.lessonsService.update(id, dto);
    }
    remove(id) {
        return this.lessonsService.remove(id);
    }
    async uploadAsset(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        return this.lessonsService.uploadAsset(id, file.path, file.originalname);
    }
};
exports.LessonsController = LessonsController;
__decorate([
    (0, common_1.Post)('courses/:courseId/lessons'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, staff_guard_1.StaffGuard),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_lesson_dto_1.CreateLessonDto]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('lessons/:id'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)('lessons/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, staff_guard_1.StaffGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lesson_dto_1.UpdateLessonDto]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('lessons/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, staff_guard_1.StaffGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('lessons/:id/upload-asset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, staff_guard_1.StaffGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => {
                const dir = (0, node_path_1.join)(process.cwd(), 'uploads', 'course-assets');
                if (!(0, node_fs_1.existsSync)(dir)) {
                    (0, node_fs_1.mkdirSync)(dir, { recursive: true });
                }
                cb(null, dir);
            },
            filename: (_req, file, cb) => {
                const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                cb(null, `${unique}${(0, node_path_1.extname)(file.originalname).toLowerCase()}`);
            },
        }),
        limits: { fileSize: 1024 * 1024 * 500 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LessonsController.prototype, "uploadAsset", null);
exports.LessonsController = LessonsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [lessons_service_1.LessonsService])
], LessonsController);
//# sourceMappingURL=lessons.controller.js.map