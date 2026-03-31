import { IsOptional, IsString } from 'class-validator';

export class QueryCoursesDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}
