import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookAppointmentHandler } from '../../../application/book-appointment.handler';
import { BookAppointmentRequestDto } from './dto/book-appointment.request.dto';

@ApiTags('appointments')
@Controller({ path: 'appointments/book-appointment', version: '1' })
export class BookAppointmentController {
  constructor(private readonly handler: BookAppointmentHandler) {}

  @Post()
  execute(@Body() request: BookAppointmentRequestDto) {
    return this.handler.execute(request);
  }
}
