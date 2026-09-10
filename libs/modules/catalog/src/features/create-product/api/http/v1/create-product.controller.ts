// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/create-product.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductHandler } from '../../../application/create-product.handler';
import { CreateProductRequestDto } from './dto/create-product.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('catalog')
@Controller({ path: 'catalog/create-product', version: '1' })
export class CreateProductController {
  constructor(private readonly handler: CreateProductHandler) {}

  @Post()
  execute(@Body() request: CreateProductRequestDto) {
    return this.handler.execute(request);
  }
}
