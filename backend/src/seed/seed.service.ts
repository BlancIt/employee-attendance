import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}

  async onModuleInit() {
    const count = await this.employeeRepo.count();
    if (count > 0) {
      this.logger.log('Database already seeded, skipping...');
      return;
    }

    this.logger.log('Seeding database with initial data...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const employees = [
      {
        name: 'Admin HRD',
        email: 'admin.hrd@gmail.com',
        password: hashedPassword,
        position: 'HRD Manager',
        phone_number: '081234567890',
        is_admin: true,
      },
      {
        name: 'M Haikal B',
        email: 'mhaikalb@gmail.com',
        password: hashedPassword,
        position: 'Software Engineer',
        phone_number: '081234567891',
        is_admin: false,
      },
      {
        name: 'Tester Guy',
        email: 'testingguy@gmail.com',
        password: hashedPassword,
        position: 'Software Tester',
        phone_number: '081234567892',
        is_admin: false,
      },
      {
        name: 'Randi Putra',
        email: 'randi.putra@gmail.com',
        password: hashedPassword,
        position: 'Super Manager',
        phone_number: '081234567893',
        is_admin: true,
      },
    ];

    for (const emp of employees) {
      const employee = this.employeeRepo.create(emp);
      await this.employeeRepo.save(employee);
    }

    this.logger.log('Database seeded successfully!');
  }
}
