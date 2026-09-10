// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/get-product.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetProductHandler } from '../../../application/get-product.handler';
import { GetProductRequestDto } from './dto/get-product.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('catalog')
@Controller({ path: 'catalog/get-product', version: '1' })
export class GetProductController {
  constructor(private readonly handler: GetProductHandler) {}

  @Post()
  execute(@Body() request: GetProductRequestDto) {
    return this.handler.execute(request);
  }
}
