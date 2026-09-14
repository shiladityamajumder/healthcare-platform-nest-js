// * Linked with: @nestjs/common, ./capture-payment.controller, ./capture-payment.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CapturePaymentController } from './capture-payment.controller';
import { CapturePaymentHandler } from './capture-payment.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CapturePaymentController],
  providers: [CapturePaymentHandler],
})
export class CapturePaymentModule {}
