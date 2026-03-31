import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { RequestUser } from '../strategies/jwt.strategy';

@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('Login required');
    }
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Admin or teacher access required');
    }
    return true;
  }
}
