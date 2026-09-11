// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/update-status.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateStatusHandler } from '../../../application/update-status.handler';
import { UpdateStatusRequestDto } from './dto/update-status.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('orders')
@Controller({ path: 'orders/update-status', version: '1' })
export class UpdateStatusController {
  constructor(private readonly handler: UpdateStatusHandler) {}

  @Post()
  execute(@Body() request: UpdateStatusRequestDto) {
    return this.handler.execute(request);
  }
}
