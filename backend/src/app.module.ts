import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig, getLogsDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    TypeOrmModule.forRootAsync({
      name: 'logsConnection',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getLogsDatabaseConfig,
    }),
    AuthModule,
    EmployeeModule,
    AttendanceModule,
    SeedModule,
  ],
})
export class AppModule {}