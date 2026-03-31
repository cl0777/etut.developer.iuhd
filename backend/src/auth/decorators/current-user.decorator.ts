import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { RequestUser } from '../strategies/jwt.strategy';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser | undefined => {
    const req = ctx.switchToHttp().getRequest<{ user?: RequestUser }>();
    return req.user;
  },
);
