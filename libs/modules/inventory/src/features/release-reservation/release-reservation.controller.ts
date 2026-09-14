// * Linked with: @nestjs/common, @nestjs/swagger, ./release-reservation.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReleaseReservationHandler } from './release-reservation.handler';
import { ReleaseReservationRequestDto } from './release-reservation.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('inventory')
@Controller({ path: 'inventory/release-reservation', version: '1' })
export class ReleaseReservationController {
  constructor(private readonly handler: ReleaseReservationHandler) {}

  @Post()
  execute(@Body() request: ReleaseReservationRequestDto) {
    return this.handler.execute(request);
  }
}
