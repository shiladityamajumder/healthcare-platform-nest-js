import { Module } from '@nestjs/common';
import { CancelAppointmentController } from './api/http/v1/cancel-appointment.controller';
import { CancelAppointmentHandler } from './application/cancel-appointment.handler';

@Module({
  controllers: [CancelAppointmentController],
  providers: [CancelAppointmentHandler],
})
export class CancelAppointmentModule {}
