import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<{ headers: { authorization?: string } }>();
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return true;
    }
    try {
      return (await super.canActivate(context)) as boolean;
    } catch {
      return true;
    }
  }

  override handleRequest<TUser>(err: unknown, user: TUser): TUser | undefined {
    if (err) {
      return undefined;
    }
    return user;
  }
}
