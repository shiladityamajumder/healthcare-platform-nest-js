import { Module } from '@nestjs/common';
import { BookAppointmentController } from './api/http/v1/book-appointment.controller';
import { BookAppointmentHandler } from './application/book-appointment.handler';

@Module({
  controllers: [BookAppointmentController],
  providers: [BookAppointmentHandler],
})
export class BookAppointmentModule {}
