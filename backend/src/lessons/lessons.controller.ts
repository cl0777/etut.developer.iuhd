import {
  Body,
  Controller,
  Delete,
  BadRequestException,
  Get,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'node:fs';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { StaffGuard } from '../auth/guards/staff.guard';
import type { RequestUser } from '../auth/strategies/jwt.strategy';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post('courses/:courseId/lessons')
  @UseGuards(JwtAuthGuard, StaffGuard)
  create(@Param('courseId') courseId: string, @Body() dto: CreateLessonDto) {
    return this.lessonsService.create(courseId, dto);
  }

  @Get('lessons/:id')
  @UseGuards(OptionalJwtAuthGuard)
  getOne(@Param('id') id: string, @CurrentUser() user?: RequestUser) {
    const viewer = user ? { id: user.id, role: user.role } : undefined;
    return this.lessonsService.findOne(id, viewer);
  }

  @Patch('lessons/:id')
  @UseGuards(JwtAuthGuard, StaffGuard)
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  @Delete('lessons/:id')
  @UseGuards(JwtAuthGuard, StaffGuard)
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }

  @Post('lessons/:id/upload-asset')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, StaffGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(process.cwd(), 'uploads', 'course-assets');
          if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
          }
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname).toLowerCase()}`);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 500 },
    }),
  )
  async uploadAsset(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.lessonsService.uploadAsset(id, file.path, file.originalname);
  }
}
