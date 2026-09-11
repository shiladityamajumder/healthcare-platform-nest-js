// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/update-product.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProductHandler } from '../../../application/update-product.handler';
import { UpdateProductRequestDto } from './dto/update-product.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('catalog')
@Controller({ path: 'catalog/update-product', version: '1' })
export class UpdateProductController {
  constructor(private readonly handler: UpdateProductHandler) {}

  @Post()
  execute(@Body() request: UpdateProductRequestDto) {
    return this.handler.execute(request);
  }
}
