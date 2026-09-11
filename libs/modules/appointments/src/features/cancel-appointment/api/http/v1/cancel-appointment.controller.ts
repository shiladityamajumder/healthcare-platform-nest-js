// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/cancel-appointment.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CancelAppointmentHandler } from '../../../application/cancel-appointment.handler';
import { CancelAppointmentRequestDto } from './dto/cancel-appointment.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('appointments')
@Controller({ path: 'appointments/cancel-appointment', version: '1' })
export class CancelAppointmentController {
  constructor(private readonly handler: CancelAppointmentHandler) {}

  @Post()
  execute(@Body() request: CancelAppointmentRequestDto) {
    return this.handler.execute(request);
  }
}
