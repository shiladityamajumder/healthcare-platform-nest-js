import { Module } from '@nestjs/common';
import { CreatePaymentController } from './api/http/v1/create-payment.controller';
import { CreatePaymentHandler } from './application/create-payment.handler';

@Module({
  controllers: [CreatePaymentController],
  providers: [CreatePaymentHandler],
})
export class CreatePaymentModule {}
