import { Module } from '@nestjs/common';
import { WebhookController } from './api/http/v1/webhook.controller';
import { WebhookHandler } from './application/webhook.handler';

@Module({
  controllers: [WebhookController],
  providers: [WebhookHandler],
})
export class WebhookModule {}
