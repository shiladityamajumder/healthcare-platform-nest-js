import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProductHandler } from '../../../application/update-product.handler';
import { UpdateProductRequestDto } from './dto/update-product.request.dto';

@ApiTags('catalog')
@Controller({ path: 'catalog/update-product', version: '1' })
export class UpdateProductController {
  constructor(private readonly handler: UpdateProductHandler) {}

  @Post()
  execute(@Body() request: UpdateProductRequestDto) {
    return this.handler.execute(request);
  }
}
