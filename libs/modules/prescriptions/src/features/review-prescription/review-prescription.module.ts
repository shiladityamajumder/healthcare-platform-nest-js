// * Linked with: @nestjs/common, ./api/http/v1/review-prescription.controller, ./application/review-prescription.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ReviewPrescriptionController } from './api/http/v1/review-prescription.controller';
import { ReviewPrescriptionHandler } from './application/review-prescription.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ReviewPrescriptionController],
  providers: [ReviewPrescriptionHandler],
})
export class ReviewPrescriptionModule {}
