// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/brands.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandsHandler } from '../../../application/brands.handler';
import { BrandsRequestDto } from './dto/brands.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('catalog')
@Controller({ path: 'catalog/brands', version: '1' })
export class BrandsController {
  constructor(private readonly handler: BrandsHandler) {}

  @Post()
  execute(@Body() request: BrandsRequestDto) {
    return this.handler.execute(request);
  }
}
