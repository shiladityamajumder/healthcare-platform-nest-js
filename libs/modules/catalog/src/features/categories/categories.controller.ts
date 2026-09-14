// * Linked with: @nestjs/common, @nestjs/swagger, ./categories.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesHandler } from './categories.handler';
import { CategoriesRequestDto } from './categories.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('catalog')
@Controller({ path: 'catalog/categories', version: '1' })
export class CategoriesController {
  constructor(private readonly handler: CategoriesHandler) {}

  @Post()
  execute(@Body() request: CategoriesRequestDto) {
    return this.handler.execute(request);
  }
}
