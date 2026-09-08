import { Module } from '@nestjs/common';
import { ReviewPrescriptionController } from './api/http/v1/review-prescription.controller';
import { ReviewPrescriptionHandler } from './application/review-prescription.handler';

@Module({
  controllers: [ReviewPrescriptionController],
  providers: [ReviewPrescriptionHandler],
})
export class ReviewPrescriptionModule {}
