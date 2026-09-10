// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/reschedule-appointment.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RescheduleAppointmentHandler } from '../../../application/reschedule-appointment.handler';
import { RescheduleAppointmentRequestDto } from './dto/reschedule-appointment.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('appointments')
@Controller({ path: 'appointments/reschedule-appointment', version: '1' })
export class RescheduleAppointmentController {
  constructor(private readonly handler: RescheduleAppointmentHandler) {}

  @Post()
  execute(@Body() request: RescheduleAppointmentRequestDto) {
    return this.handler.execute(request);
  }
}
