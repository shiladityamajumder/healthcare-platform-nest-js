// * Linked with: @nestjs/common, ./reschedule-appointment.controller, ./reschedule-appointment.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { RescheduleAppointmentController } from './reschedule-appointment.controller';
import { RescheduleAppointmentHandler } from './reschedule-appointment.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [RescheduleAppointmentController],
  providers: [RescheduleAppointmentHandler],
})
export class RescheduleAppointmentModule {}
