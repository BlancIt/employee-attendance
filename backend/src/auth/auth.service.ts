import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const employee = await this.employeeRepo.findOne({ where: { email } });
    if (!employee) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: employee.id, email: employee.email, is_admin: employee.is_admin };
    return {
      access_token: this.jwtService.sign(payload),
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        is_admin: employee.is_admin,
      },
    };
  }
}
