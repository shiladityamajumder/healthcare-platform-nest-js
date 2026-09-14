// * Linked with: @nestjs/common, @nestjs/swagger, ./delivery-status.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeliveryStatusHandler } from './delivery-status.handler';
import { DeliveryStatusRequestDto } from './delivery-status.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('notifications')
@Controller({ path: 'notifications/delivery-status', version: '1' })
export class DeliveryStatusController {
  constructor(private readonly handler: DeliveryStatusHandler) {}

  @Post()
  execute(@Body() request: DeliveryStatusRequestDto) {
    return this.handler.execute(request);
  }
}
