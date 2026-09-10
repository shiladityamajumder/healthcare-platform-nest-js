// Linked with: @nestjs/common, ./api/http/v1/reschedule-appointment.controller, ./application/reschedule-appointment.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { RescheduleAppointmentController } from './api/http/v1/reschedule-appointment.controller';
import { RescheduleAppointmentHandler } from './application/reschedule-appointment.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [RescheduleAppointmentController],
  providers: [RescheduleAppointmentHandler],
})
export class RescheduleAppointmentModule {}
