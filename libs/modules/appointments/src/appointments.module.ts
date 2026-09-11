// * Linked with: @nestjs/common, ./features/availability/availability.module, ./features/book-appointment/book-appointment.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { AvailabilityModule } from './features/availability/availability.module';
import { BookAppointmentModule } from './features/book-appointment/book-appointment.module';
import { RescheduleAppointmentModule } from './features/reschedule-appointment/reschedule-appointment.module';
import { CancelAppointmentModule } from './features/cancel-appointment/cancel-appointment.module';

/** Composition root for the Appointments bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [
    AvailabilityModule,
    BookAppointmentModule,
    RescheduleAppointmentModule,
    CancelAppointmentModule,
  ],
  exports: [],
})
export class AppointmentsModule {}
