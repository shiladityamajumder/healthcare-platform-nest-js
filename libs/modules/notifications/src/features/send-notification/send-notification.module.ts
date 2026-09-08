import { Module } from '@nestjs/common';
import { SendNotificationController } from './api/http/v1/send-notification.controller';
import { SendNotificationHandler } from './application/send-notification.handler';

@Module({
  controllers: [SendNotificationController],
  providers: [SendNotificationHandler],
})
export class SendNotificationModule {}
