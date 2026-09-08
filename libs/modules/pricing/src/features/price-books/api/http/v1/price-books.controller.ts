import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PriceBooksHandler } from '../../../application/price-books.handler';
import { PriceBooksRequestDto } from './dto/price-books.request.dto';

@ApiTags('pricing')
@Controller({ path: 'pricing/price-books', version: '1' })
export class PriceBooksController {
  constructor(private readonly handler: PriceBooksHandler) {}

  @Post()
  execute(@Body() request: PriceBooksRequestDto) {
    return this.handler.execute(request);
  }
}
