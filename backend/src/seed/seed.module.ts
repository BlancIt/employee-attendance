import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Employee } from '../entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [SeedService],
})
export class SeedModule {}
