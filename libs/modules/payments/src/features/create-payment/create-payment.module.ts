// * Linked with: @nestjs/common, ./api/http/v1/create-payment.controller, ./application/create-payment.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreatePaymentController } from './api/http/v1/create-payment.controller';
import { CreatePaymentHandler } from './application/create-payment.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CreatePaymentController],
  providers: [CreatePaymentHandler],
})
export class CreatePaymentModule {}
