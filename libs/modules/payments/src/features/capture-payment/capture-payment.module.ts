// Linked with: @nestjs/common, ./api/http/v1/capture-payment.controller, ./application/capture-payment.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CapturePaymentController } from './api/http/v1/capture-payment.controller';
import { CapturePaymentHandler } from './application/capture-payment.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CapturePaymentController],
  providers: [CapturePaymentHandler],
})
export class CapturePaymentModule {}
