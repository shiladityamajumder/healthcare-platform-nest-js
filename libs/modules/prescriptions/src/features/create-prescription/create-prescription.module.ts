import { Module } from '@nestjs/common';
import { CreatePrescriptionController } from './api/http/v1/create-prescription.controller';
import { CreatePrescriptionHandler } from './application/create-prescription.handler';

@Module({
  controllers: [CreatePrescriptionController],
  providers: [CreatePrescriptionHandler],
})
export class CreatePrescriptionModule {}
