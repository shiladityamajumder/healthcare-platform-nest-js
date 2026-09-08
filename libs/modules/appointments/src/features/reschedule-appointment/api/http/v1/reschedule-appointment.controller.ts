import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RescheduleAppointmentHandler } from '../../../application/reschedule-appointment.handler';
import { RescheduleAppointmentRequestDto } from './dto/reschedule-appointment.request.dto';

@ApiTags('appointments')
@Controller({ path: 'appointments/reschedule-appointment', version: '1' })
export class RescheduleAppointmentController {
  constructor(private readonly handler: RescheduleAppointmentHandler) {}

  @Post()
  execute(@Body() request: RescheduleAppointmentRequestDto) {
    return this.handler.execute(request);
  }
}
