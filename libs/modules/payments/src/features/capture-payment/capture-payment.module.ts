import { Module } from '@nestjs/common';
import { CapturePaymentController } from './api/http/v1/capture-payment.controller';
import { CapturePaymentHandler } from './application/capture-payment.handler';

@Module({
  controllers: [CapturePaymentController],
  providers: [CapturePaymentHandler],
})
export class CapturePaymentModule {}
