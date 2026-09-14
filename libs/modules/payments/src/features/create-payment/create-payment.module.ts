// * Linked with: @nestjs/common, ./create-payment.controller, ./create-payment.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreatePaymentController } from './create-payment.controller';
import { CreatePaymentHandler } from './create-payment.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CreatePaymentController],
  providers: [CreatePaymentHandler],
})
export class CreatePaymentModule {}
