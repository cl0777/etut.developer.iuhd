import { LessonContentType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  description?: string;

  @IsEnum(LessonContentType)
  contentType!: LessonContentType;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  contentUrl?: string;
}
