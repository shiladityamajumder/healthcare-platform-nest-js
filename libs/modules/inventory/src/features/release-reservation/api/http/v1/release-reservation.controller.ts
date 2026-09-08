import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReleaseReservationHandler } from '../../../application/release-reservation.handler';
import { ReleaseReservationRequestDto } from './dto/release-reservation.request.dto';

@ApiTags('inventory')
@Controller({ path: 'inventory/release-reservation', version: '1' })
export class ReleaseReservationController {
  constructor(private readonly handler: ReleaseReservationHandler) {}

  @Post()
  execute(@Body() request: ReleaseReservationRequestDto) {
    return this.handler.execute(request);
  }
}
