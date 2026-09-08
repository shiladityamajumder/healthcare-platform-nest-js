import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AvailabilityHandler } from '../../../application/availability.handler';
import { AvailabilityRequestDto } from './dto/availability.request.dto';

@ApiTags('appointments')
@Controller({ path: 'appointments/availability', version: '1' })
export class AvailabilityController {
  constructor(private readonly handler: AvailabilityHandler) {}

  @Post()
  execute(@Body() request: AvailabilityRequestDto) {
    return this.handler.execute(request);
  }
}
