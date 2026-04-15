import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '../entities/employee.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    private notificationService: NotificationService,
  ) {}

  // For getting user's profile
  async findById(id: number): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'photo_url', 'position', 'phone_number', 'is_admin', 'created_at', 'updated_at'],
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  // Update user's profile data (phone number and profile picture). Alsp sent notification to admin for each change
   async updateProfile(id: number, data: { phone_number?: string; photo_url?: string }): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    const changes: { field: string; oldValue: string; newValue: string }[] = [];

    if (data.phone_number !== undefined && data.phone_number !== employee.phone_number) {
      changes.push({ field: 'phone_number', oldValue: employee.phone_number || '', newValue: data.phone_number });
      employee.phone_number = data.phone_number;
    }
    if (data.photo_url !== undefined && data.photo_url !== employee.photo_url) {
      changes.push({ field: 'photo_url', oldValue: employee.photo_url || '', newValue: data.photo_url });
      employee.photo_url = data.photo_url;
    }

    const saved = await this.employeeRepo.save(employee);

    // Send notification for each change
    for (const change of changes) {
      await this.notificationService.sendProfileChangeNotification({
        employeeId: id,
        employeeName: employee.name,
        field: change.field,
        oldValue: change.oldValue,
        newValue: change.newValue,
      });
    }

    const { password, ...result } = saved;
    return result as Employee;
  }

  // Change user's password, encrypted in bcrypt. Requires validating old password first. Also notify Admin for changes in password
    async changePassword(id: number, oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const employee = await this.employeeRepo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    const isValid = await bcrypt.compare(oldPassword, employee.password);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    employee.password = await bcrypt.hash(newPassword, 10);
    await this.employeeRepo.save(employee);

    await this.notificationService.sendProfileChangeNotification({
      employeeId: id,
      employeeName: employee.name,
      field: 'password',
      oldValue: '***',
      newValue: '***',
    });

    return { message: 'Password changed successfully' };
  }

  // Get all employees data, with password not included
  async findAll(): Promise<Employee[]> {
    return this.employeeRepo.find({
      select: ['id', 'name', 'email', 'photo_url', 'position', 'phone_number', 'is_admin', 'created_at', 'updated_at'],
    });
  }

  // Create an employee data
  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    const existing = await this.employeeRepo.findOne({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Email already exists');

    if (!data.password) throw new BadRequestException('Password is required');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const employee = this.employeeRepo.create({ ...data, password: hashedPassword });
    const saved = await this.employeeRepo.save(employee);
    const { password: _pw, ...result } = saved;
    return result as Employee;
  }

  // Updates an employee data
  async updateEmployee(id: number, data: Partial<Employee>): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(employee, data);
    const saved = await this.employeeRepo.save(employee);
    const { password, ...result } = saved;
    return result as Employee;
  }
}
