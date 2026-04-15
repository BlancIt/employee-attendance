import { Controller, Get, Post, Query, UseGuards, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/roles.guard';

@Controller('attendances')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('clock-in')
  async clockIn(@Request() req) {
    return this.attendanceService.clockIn(req.user.id);
  }

  @Post('clock-out')
  async clockOut(@Request() req) {
    return this.attendanceService.clockOut(req.user.id);
  }

  @Get('me')
  async getMyAttendance(@Request() req, @Query('from') from?: string, @Query('to') to?: string) {
    return this.attendanceService.getMyAttendance(req.user.id, from, to);
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllAttendance(@Query('from') from?: string, @Query('to') to?: string) {
    return this.attendanceService.getAllAttendance(from, to);
  }
}