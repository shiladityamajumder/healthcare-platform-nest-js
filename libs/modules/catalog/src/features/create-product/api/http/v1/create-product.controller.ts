import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductHandler } from '../../../application/create-product.handler';
import { CreateProductRequestDto } from './dto/create-product.request.dto';

@ApiTags('catalog')
@Controller({ path: 'catalog/create-product', version: '1' })
export class CreateProductController {
  constructor(private readonly handler: CreateProductHandler) {}

  @Post()
  execute(@Body() request: CreateProductRequestDto) {
    return this.handler.execute(request);
  }
}
