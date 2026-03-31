import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AdminEnrollUserDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
