import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListProductsHandler } from '../../../application/list-products.handler';
import { ListProductsRequestDto } from './dto/list-products.request.dto';

@ApiTags('catalog')
@Controller({ path: 'catalog/list-products', version: '1' })
export class ListProductsController {
  constructor(private readonly handler: ListProductsHandler) {}

  @Post()
  execute(@Body() request: ListProductsRequestDto) {
    return this.handler.execute(request);
  }
}
