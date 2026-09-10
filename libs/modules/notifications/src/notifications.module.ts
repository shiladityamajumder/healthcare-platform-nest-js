// Linked with: @nestjs/common, ./features/send-notification/send-notification.module, ./features/preferences/preferences.module.
// Used by: the application module or feature root during NestJS startup.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { SendNotificationModule } from './features/send-notification/send-notification.module';
import { PreferencesModule } from './features/preferences/preferences.module';
import { TemplatesModule } from './features/templates/templates.module';
import { DeliveryStatusModule } from './features/delivery-status/delivery-status.module';

/** Composition root for the Notifications bounded context. */
// Register the feature components and their dependencies with NestJS.
@Module({
  imports: [SendNotificationModule, PreferencesModule, TemplatesModule, DeliveryStatusModule],
  exports: [],
})
export class NotificationsModule {}
