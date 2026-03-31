import { UserRole } from '@prisma/client';

/** Claims stored in our access JWT (distinct from `jsonwebtoken.JwtPayload`). */
export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
};
