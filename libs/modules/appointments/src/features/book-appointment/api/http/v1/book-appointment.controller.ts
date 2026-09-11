// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/book-appointment.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookAppointmentHandler } from '../../../application/book-appointment.handler';
import { BookAppointmentRequestDto } from './dto/book-appointment.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('appointments')
@Controller({ path: 'appointments/book-appointment', version: '1' })
export class BookAppointmentController {
  constructor(private readonly handler: BookAppointmentHandler) {}

  @Post()
  execute(@Body() request: BookAppointmentRequestDto) {
    return this.handler.execute(request);
  }
}
