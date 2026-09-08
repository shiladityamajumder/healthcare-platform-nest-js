import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesHandler } from '../../../application/categories.handler';
import { CategoriesRequestDto } from './dto/categories.request.dto';

@ApiTags('catalog')
@Controller({ path: 'catalog/categories', version: '1' })
export class CategoriesController {
  constructor(private readonly handler: CategoriesHandler) {}

  @Post()
  execute(@Body() request: CategoriesRequestDto) {
    return this.handler.execute(request);
  }
}
