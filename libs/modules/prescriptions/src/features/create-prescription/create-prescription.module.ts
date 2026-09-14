// * Linked with: @nestjs/common, ./create-prescription.controller, ./create-prescription.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreatePrescriptionController } from './create-prescription.controller';
import { CreatePrescriptionHandler } from './create-prescription.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CreatePrescriptionController],
  providers: [CreatePrescriptionHandler],
})
export class CreatePrescriptionModule {}
