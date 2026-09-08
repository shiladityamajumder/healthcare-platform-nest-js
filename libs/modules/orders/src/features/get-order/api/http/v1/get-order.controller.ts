import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetOrderHandler } from '../../../application/get-order.handler';
import { GetOrderRequestDto } from './dto/get-order.request.dto';

@ApiTags('orders')
@Controller({ path: 'orders/get-order', version: '1' })
export class GetOrderController {
  constructor(private readonly handler: GetOrderHandler) {}

  @Post()
  execute(@Body() request: GetOrderRequestDto) {
    return this.handler.execute(request);
  }
}
