import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderHandler } from '../../../application/create-order.handler';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';

@ApiTags('orders')
@Controller({ path: 'orders/create-order', version: '1' })
export class CreateOrderController {
  constructor(private readonly handler: CreateOrderHandler) {}

  @Post()
  execute(@Body() request: CreateOrderRequestDto) {
    return this.handler.execute(request);
  }
}
