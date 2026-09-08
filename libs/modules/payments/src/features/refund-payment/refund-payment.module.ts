import { Module } from '@nestjs/common';
import { RefundPaymentController } from './api/http/v1/refund-payment.controller';
import { RefundPaymentHandler } from './application/refund-payment.handler';

@Module({
  controllers: [RefundPaymentController],
  providers: [RefundPaymentHandler],
})
export class RefundPaymentModule {}
