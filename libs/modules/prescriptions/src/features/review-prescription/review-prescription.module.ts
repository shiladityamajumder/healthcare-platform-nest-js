// * Linked with: @nestjs/common, ./review-prescription.controller, ./review-prescription.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ReviewPrescriptionController } from './review-prescription.controller';
import { ReviewPrescriptionHandler } from './review-prescription.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ReviewPrescriptionController],
  providers: [ReviewPrescriptionHandler],
})
export class ReviewPrescriptionModule {}
