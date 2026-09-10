// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/get-order.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetOrderHandler } from '../../../application/get-order.handler';
import { GetOrderRequestDto } from './dto/get-order.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('orders')
@Controller({ path: 'orders/get-order', version: '1' })
export class GetOrderController {
  constructor(private readonly handler: GetOrderHandler) {}

  @Post()
  execute(@Body() request: GetOrderRequestDto) {
    return this.handler.execute(request);
  }
}
