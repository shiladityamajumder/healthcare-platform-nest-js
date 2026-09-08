import { Module } from '@nestjs/common';
import { RescheduleAppointmentController } from './api/http/v1/reschedule-appointment.controller';
import { RescheduleAppointmentHandler } from './application/reschedule-appointment.handler';

@Module({
  controllers: [RescheduleAppointmentController],
  providers: [RescheduleAppointmentHandler],
})
export class RescheduleAppointmentModule {}
