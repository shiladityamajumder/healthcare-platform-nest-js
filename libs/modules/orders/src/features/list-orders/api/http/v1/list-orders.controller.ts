// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/list-orders.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListOrdersHandler } from '../../../application/list-orders.handler';
import { ListOrdersRequestDto } from './dto/list-orders.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('orders')
@Controller({ path: 'orders/list-orders', version: '1' })
export class ListOrdersController {
  constructor(private readonly handler: ListOrdersHandler) {}

  @Post()
  execute(@Body() request: ListOrdersRequestDto) {
    return this.handler.execute(request);
  }
}
