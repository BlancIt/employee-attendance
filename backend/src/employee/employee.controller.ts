import { Controller, Get, Post, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get('me')
  async getProfile(@Request() req) {
    return this.employeeService.findById(req.user.id);
  }

  @Patch('me')
  async updateProfile(@Request() req, @Body() body: { phone_number?: string; photo_url?: string }) {
    return this.employeeService.updateProfile(req.user.id, body);
  }

  @Post('me/change-password')
  async changePassword(@Request() req, @Body() body: { oldPassword: string; newPassword: string }) {
    return this.employeeService.changePassword(req.user.id, body.oldPassword, body.newPassword);
  }
}
