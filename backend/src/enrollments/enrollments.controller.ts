import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestUser } from '../auth/strategies/jwt.strategy';
import { AdminEnrollUserDto } from './dto/admin-enroll-user.dto';
import { EnrollmentsService } from './enrollments.service';

@Controller('courses')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  enroll(@Param('id') courseId: string, @CurrentUser() user: RequestUser) {
    return this.enrollmentsService.enroll(user.id, courseId);
  }

  @Delete(':id/enroll')
  @UseGuards(JwtAuthGuard)
  unenroll(@Param('id') courseId: string, @CurrentUser() user: RequestUser) {
    return this.enrollmentsService.unenroll(user.id, courseId);
  }

  @Post(':id/admin-enroll-user')
  @UseGuards(JwtAuthGuard, AdminGuard)
  enrollUserAsAdmin(
    @Param('id') courseId: string,
    @Body() dto: AdminEnrollUserDto,
  ) {
    return this.enrollmentsService.adminEnrollUser(courseId, dto);
  }

  @Get(':id/enrollments')
  @UseGuards(JwtAuthGuard, AdminGuard)
  listEnrollments(
    @Param('id') courseId: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.enrollmentsService.listCourseEnrollments(courseId, {
      search,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }
}
