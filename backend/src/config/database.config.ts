import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [__dirname + '/../entities/employee.entity{.ts,.js}', __dirname + '/../entities/attendance.entity{.ts,.js}'],
  synchronize: true,
});

export const getLogsDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  name: 'logsConnection',
  host: configService.get('LOGS_DB_HOST'),
  port: configService.get<number>('LOGS_DB_PORT'),
  username: configService.get('LOGS_DB_USERNAME'),
  password: configService.get('LOGS_DB_PASSWORD'),
  database: configService.get('LOGS_DB_DATABASE'),
  entities: [__dirname + '/../entities/change-log.entity{.ts,.js}'],
  synchronize: true,
});