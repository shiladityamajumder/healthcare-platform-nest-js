// * Linked with: @nestjs/common, @nestjs/swagger, ./availability.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AvailabilityHandler } from './availability.handler';
import { AvailabilityRequestDto } from './availability.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('appointments')
@Controller({ path: 'appointments/availability', version: '1' })
export class AvailabilityController {
  constructor(private readonly handler: AvailabilityHandler) {}

  @Post()
  execute(@Body() request: AvailabilityRequestDto) {
    return this.handler.execute(request);
  }
}
