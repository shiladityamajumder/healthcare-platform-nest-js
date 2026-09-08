import { Module } from '@nestjs/common';
import { GetPrescriptionController } from './api/http/v1/get-prescription.controller';
import { GetPrescriptionHandler } from './application/get-prescription.handler';

@Module({
  controllers: [GetPrescriptionController],
  providers: [GetPrescriptionHandler],
})
export class GetPrescriptionModule {}
