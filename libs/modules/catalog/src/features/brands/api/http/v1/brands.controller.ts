import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandsHandler } from '../../../application/brands.handler';
import { BrandsRequestDto } from './dto/brands.request.dto';

@ApiTags('catalog')
@Controller({ path: 'catalog/brands', version: '1' })
export class BrandsController {
  constructor(private readonly handler: BrandsHandler) {}

  @Post()
  execute(@Body() request: BrandsRequestDto) {
    return this.handler.execute(request);
  }
}
