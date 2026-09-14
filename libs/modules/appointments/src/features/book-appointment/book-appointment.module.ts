// * Linked with: @nestjs/common, ./book-appointment.controller, ./book-appointment.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { BookAppointmentController } from './book-appointment.controller';
import { BookAppointmentHandler } from './book-appointment.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [BookAppointmentController],
  providers: [BookAppointmentHandler],
})
export class BookAppointmentModule {}
