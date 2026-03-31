import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import type { RequestUser } from '../auth/strategies/jwt.strategy';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  listPublished(
    @Query() query: QueryCoursesDto,
    @CurrentUser() user?: RequestUser,
  ) {
    const viewer = user
      ? { id: user.id, role: user.role as UserRole }
      : undefined;
    return this.coursesService.findPublished(query, viewer);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  listAdmin() {
    return this.coursesService.findAllAdmin();
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  getOne(@Param('id') id: string, @CurrentUser() user?: RequestUser) {
    const viewer = user
      ? { id: user.id, role: user.role as UserRole }
      : undefined;
    return this.coursesService.findOnePublic(id, viewer);
  }

  @Get(':id/lessons')
  @UseGuards(OptionalJwtAuthGuard)
  lessons(@Param('id') id: string, @CurrentUser() user?: RequestUser) {
    const viewer = user
      ? { id: user.id, role: user.role as UserRole }
      : undefined;
    return this.coursesService.lessonsForCourse(id, viewer);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
