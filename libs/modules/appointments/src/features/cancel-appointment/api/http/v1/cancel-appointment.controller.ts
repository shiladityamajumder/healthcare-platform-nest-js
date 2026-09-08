import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CancelAppointmentHandler } from '../../../application/cancel-appointment.handler';
import { CancelAppointmentRequestDto } from './dto/cancel-appointment.request.dto';

@ApiTags('appointments')
@Controller({ path: 'appointments/cancel-appointment', version: '1' })
export class CancelAppointmentController {
  constructor(private readonly handler: CancelAppointmentHandler) {}

  @Post()
  execute(@Body() request: CancelAppointmentRequestDto) {
    return this.handler.execute(request);
  }
}
