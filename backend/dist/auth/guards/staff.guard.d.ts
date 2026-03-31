import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class StaffGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
