import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeLog } from '../entities/change-log.entity';
import { NotificationGateway } from './notification.gateway';

interface ProfileChangeEvent {
  employeeId: number;
  employeeName: string;
  field: string;
  oldValue: string;
  newValue: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private rabbitChannel: any = null;

  constructor(
    @InjectRepository(ChangeLog, 'logsConnection')
    private changeLogRepo: Repository<ChangeLog>,
    private notificationGateway: NotificationGateway,
  ) {
    this.initRabbitMQ();
  }

  // Initial setting for RabbitMQ, start listening to messages on a queue (profile_changes) and adds log to change_logs table on employee log database
  private async initRabbitMQ() {
    try {
      const amqplib = await import('amqplib');
      const url = process.env.RABBITMQ_URL || 'amqp://employee_admin:User12345@localhost:5672';
      const connection = await amqplib.connect(url);
      this.rabbitChannel = await connection.createChannel();
      await this.rabbitChannel.assertQueue('profile_changes', { durable: true });

      this.rabbitChannel.consume('profile_changes', async (msg: any) => {
        if (msg) {
          try {
            const data: ProfileChangeEvent = JSON.parse(msg.content.toString());
            const log = this.changeLogRepo.create({
              employee_id: data.employeeId,
              employee_name: data.employeeName,
              field_changed: data.field,
              old_value: data.oldValue,
              new_value: data.newValue,
            });
            await this.changeLogRepo.save(log);
            this.logger.log(`Change log saved: ${data.employeeName} changed ${data.field}`);
            this.rabbitChannel.ack(msg);
          } catch (err) {
            this.logger.error('Failed to process message', err);
            this.rabbitChannel.nack(msg);
          }
        }
      });

      this.logger.log('RabbitMQ connected and consuming profile_changes queue');
    } catch (error: any) {
      this.logger.warn('RabbitMQ connection failed, falling back to direct DB logging', error.message);
    }
  }

  // Called when employee updates profile, this will send real-time notification to admin and send to queue for RabbiMQq to consume
  async sendProfileChangeNotification(event: ProfileChangeEvent) {
    this.notificationGateway.sendNotificationToAdmins({
      type: 'PROFILE_CHANGE',
      message: `${event.employeeName} updated their ${event.field}`,
      data: event,
      timestamp: new Date().toISOString(),
    });

    if (this.rabbitChannel) {
      try {
        this.rabbitChannel.sendToQueue(
          'profile_changes',
          Buffer.from(JSON.stringify(event)),
          { persistent: true },
        );
        this.logger.log(`Published to RabbitMQ: ${event.employeeName} - ${event.field}`);
      } catch (error) {
        this.logger.error('Failed to publish to RabbitMQ, saving directly', error);
        await this.saveLogDirectly(event);
      }
    } else {
      await this.saveLogDirectly(event);
    }
  }

  // Directly save log in case RabbitMQ is down
  private async saveLogDirectly(event: ProfileChangeEvent) {
    const log = this.changeLogRepo.create({
      employee_id: event.employeeId,
      employee_name: event.employeeName,
      field_changed: event.field,
      old_value: event.oldValue,
      new_value: event.newValue,
    });
    await this.changeLogRepo.save(log);
  }
}