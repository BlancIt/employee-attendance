import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}

  async findById(id: number): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'photo_url', 'position', 'phone_number', 'is_admin', 'created_at', 'updated_at'],
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async updateProfile(id: number, data: { phone_number?: string; photo_url?: string }): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    if (data.phone_number !== undefined) {
      employee.phone_number = data.phone_number;
    }
    if (data.photo_url !== undefined) {
      employee.photo_url = data.photo_url;
    }

    const saved = await this.employeeRepo.save(employee);
    const { password, ...result } = saved;
    return result as Employee;
  }

  async changePassword(id: number, oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const employee = await this.employeeRepo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    const isValid = await bcrypt.compare(oldPassword, employee.password);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    employee.password = await bcrypt.hash(newPassword, 10);
    await this.employeeRepo.save(employee);

    return { message: 'Password changed successfully' };
  }
}
