import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/roles.guard';

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

  // Admin Access Only Endpoints
  @Get()
  @UseGuards(AdminGuard)
  async findAll() {
    return this.employeeService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  async createEmployee(@Body() body: any) {
    return this.employeeService.createEmployee(body);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async updateEmployee(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.employeeService.updateEmployee(id, body);
  }
}
