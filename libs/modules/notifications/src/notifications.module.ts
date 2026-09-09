import { Module } from '@nestjs/common';
import { SendNotificationModule } from './features/send-notification/send-notification.module';
import { PreferencesModule } from './features/preferences/preferences.module';
import { TemplatesModule } from './features/templates/templates.module';
import { DeliveryStatusModule } from './features/delivery-status/delivery-status.module';

/** Composition root for the Notifications bounded context. */
@Module({
  imports: [SendNotificationModule, PreferencesModule, TemplatesModule, DeliveryStatusModule],
  exports: [],
})
export class NotificationsModule {}
