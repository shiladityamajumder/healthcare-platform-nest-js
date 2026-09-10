// Linked with: @nestjs/common, ./api/http/v1/webhook.controller, ./application/webhook.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { WebhookController } from './api/http/v1/webhook.controller';
import { WebhookHandler } from './application/webhook.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [WebhookController],
  providers: [WebhookHandler],
})
export class WebhookModule {}
