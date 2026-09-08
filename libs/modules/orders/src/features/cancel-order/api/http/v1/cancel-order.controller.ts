import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CancelOrderHandler } from '../../../application/cancel-order.handler';
import { CancelOrderRequestDto } from './dto/cancel-order.request.dto';

@ApiTags('orders')
@Controller({ path: 'orders/cancel-order', version: '1' })
export class CancelOrderController {
  constructor(private readonly handler: CancelOrderHandler) {}

  @Post()
  execute(@Body() request: CancelOrderRequestDto) {
    return this.handler.execute(request);
  }
}
