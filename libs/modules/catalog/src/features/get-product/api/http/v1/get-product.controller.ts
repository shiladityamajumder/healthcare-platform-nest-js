import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetProductHandler } from '../../../application/get-product.handler';
import { GetProductRequestDto } from './dto/get-product.request.dto';

@ApiTags('catalog')
@Controller({ path: 'catalog/get-product', version: '1' })
export class GetProductController {
  constructor(private readonly handler: GetProductHandler) {}

  @Post()
  execute(@Body() request: GetProductRequestDto) {
    return this.handler.execute(request);
  }
}
