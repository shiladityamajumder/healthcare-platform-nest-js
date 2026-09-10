// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/cancel-order.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CancelOrderHandler } from '../../../application/cancel-order.handler';
import { CancelOrderRequestDto } from './dto/cancel-order.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('orders')
@Controller({ path: 'orders/cancel-order', version: '1' })
export class CancelOrderController {
  constructor(private readonly handler: CancelOrderHandler) {}

  @Post()
  execute(@Body() request: CancelOrderRequestDto) {
    return this.handler.execute(request);
  }
}
