import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { ChangeLog } from '../entities/change-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChangeLog], 'logsConnection')],
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService],
})
export class NotificationModule {}