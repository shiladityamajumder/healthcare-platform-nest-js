// * Linked with: @nestjs/common, ./send-notification.controller, ./send-notification.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { SendNotificationController } from './send-notification.controller';
import { SendNotificationHandler } from './send-notification.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [SendNotificationController],
  providers: [SendNotificationHandler],
})
export class SendNotificationModule {}
