import { Module } from '@nestjs/common';
import { AvailabilityModule } from './features/availability/availability.module';
import { BookAppointmentModule } from './features/book-appointment/book-appointment.module';
import { RescheduleAppointmentModule } from './features/reschedule-appointment/reschedule-appointment.module';
import { CancelAppointmentModule } from './features/cancel-appointment/cancel-appointment.module';

/** Composition root for the Appointments bounded context. */
@Module({
  imports: [
    AvailabilityModule,
    BookAppointmentModule,
    RescheduleAppointmentModule,
    CancelAppointmentModule
  ],
  exports: [],
})
export class AppointmentsModule {}
