// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/create-order.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderHandler } from '../../../application/create-order.handler';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('orders')
@Controller({ path: 'orders/create-order', version: '1' })
export class CreateOrderController {
  constructor(private readonly handler: CreateOrderHandler) {}

  @Post()
  execute(@Body() request: CreateOrderRequestDto) {
    return this.handler.execute(request);
  }
}
