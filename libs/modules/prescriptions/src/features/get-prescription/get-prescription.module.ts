// * Linked with: @nestjs/common, ./api/http/v1/get-prescription.controller, ./application/get-prescription.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetPrescriptionController } from './api/http/v1/get-prescription.controller';
import { GetPrescriptionHandler } from './application/get-prescription.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetPrescriptionController],
  providers: [GetPrescriptionHandler],
})
export class GetPrescriptionModule {}
