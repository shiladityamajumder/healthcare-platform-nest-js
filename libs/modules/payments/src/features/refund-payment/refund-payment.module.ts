// * Linked with: @nestjs/common, ./api/http/v1/refund-payment.controller, ./application/refund-payment.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { RefundPaymentController } from './api/http/v1/refund-payment.controller';
import { RefundPaymentHandler } from './application/refund-payment.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [RefundPaymentController],
  providers: [RefundPaymentHandler],
})
export class RefundPaymentModule {}
