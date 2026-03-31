"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffGuard = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let StaffGuard = class StaffGuard {
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user) {
            throw new common_1.ForbiddenException('Login required');
        }
        if (user.role !== client_1.UserRole.ADMIN && user.role !== client_1.UserRole.TEACHER) {
            throw new common_1.ForbiddenException('Admin or teacher access required');
        }
        return true;
    }
};
exports.StaffGuard = StaffGuard;
exports.StaffGuard = StaffGuard = __decorate([
    (0, common_1.Injectable)()
], StaffGuard);
//# sourceMappingURL=staff.guard.js.map