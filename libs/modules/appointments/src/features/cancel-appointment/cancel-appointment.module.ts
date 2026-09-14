// * Linked with: @nestjs/common, ./cancel-appointment.controller, ./cancel-appointment.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CancelAppointmentController } from './cancel-appointment.controller';
import { CancelAppointmentHandler } from './cancel-appointment.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CancelAppointmentController],
  providers: [CancelAppointmentHandler],
})
export class CancelAppointmentModule {}
