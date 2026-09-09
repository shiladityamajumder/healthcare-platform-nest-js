import { Module } from '@nestjs/common';
import { CreatePaymentModule } from './features/create-payment/create-payment.module';
import { CapturePaymentModule } from './features/capture-payment/capture-payment.module';
import { RefundPaymentModule } from './features/refund-payment/refund-payment.module';
import { WebhookModule } from './features/webhook/webhook.module';

/** Composition root for the Payments bounded context. */
@Module({
  imports: [CreatePaymentModule, CapturePaymentModule, RefundPaymentModule, WebhookModule],
  exports: [],
})
export class PaymentsModule {}
