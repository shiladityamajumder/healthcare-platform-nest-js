// Linked with: @nestjs/common, ./features/create-payment/create-payment.module, ./features/capture-payment/capture-payment.module.
// Used by: the application module or feature root during NestJS startup.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreatePaymentModule } from './features/create-payment/create-payment.module';
import { CapturePaymentModule } from './features/capture-payment/capture-payment.module';
import { RefundPaymentModule } from './features/refund-payment/refund-payment.module';
import { WebhookModule } from './features/webhook/webhook.module';

/** Composition root for the Payments bounded context. */
// Register the feature components and their dependencies with NestJS.
@Module({
  imports: [CreatePaymentModule, CapturePaymentModule, RefundPaymentModule, WebhookModule],
  exports: [],
})
export class PaymentsModule {}
