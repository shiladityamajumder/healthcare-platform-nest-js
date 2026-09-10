// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/price-books.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PriceBooksHandler } from '../../../application/price-books.handler';
import { PriceBooksRequestDto } from './dto/price-books.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('pricing')
@Controller({ path: 'pricing/price-books', version: '1' })
export class PriceBooksController {
  constructor(private readonly handler: PriceBooksHandler) {}

  @Post()
  execute(@Body() request: PriceBooksRequestDto) {
    return this.handler.execute(request);
  }
}
