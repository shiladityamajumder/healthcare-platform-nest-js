import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListOrdersHandler } from '../../../application/list-orders.handler';
import { ListOrdersRequestDto } from './dto/list-orders.request.dto';

@ApiTags('orders')
@Controller({ path: 'orders/list-orders', version: '1' })
export class ListOrdersController {
  constructor(private readonly handler: ListOrdersHandler) {}

  @Post()
  execute(@Body() request: ListOrdersRequestDto) {
    return this.handler.execute(request);
  }
}
