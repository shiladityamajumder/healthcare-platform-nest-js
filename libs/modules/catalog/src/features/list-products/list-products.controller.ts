// * Linked with: @nestjs/common, @nestjs/swagger, ./list-products.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListProductsHandler } from './list-products.handler';
import { ListProductsRequestDto } from './list-products.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('catalog')
@Controller({ path: 'catalog/list-products', version: '1' })
export class ListProductsController {
  constructor(private readonly handler: ListProductsHandler) {}

  @Post()
  execute(@Body() request: ListProductsRequestDto) {
    return this.handler.execute(request);
  }
}
