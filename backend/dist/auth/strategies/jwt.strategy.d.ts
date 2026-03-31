import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import type { AccessTokenPayload } from '../jwt-payload';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(payload: AccessTokenPayload): Promise<{
        email: string;
        name: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
}
export type RequestUser = {
    id: string;
    email: string;
    name: string;
    role: UserRole;
};
export {};
