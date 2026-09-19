import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  PriceBookCreateDto,
  PriceBookListQueryDto,
  PriceBookUpdateDto,
} from './price-books.schema';
import { auditActor } from '../../contracts/pricing-context';
import { PriceBooksService } from './price-books.service';

@ApiTags('price-books')
@Controller({ path: 'price-books', version: '1' })
export class PriceBooksController {
  constructor(private readonly service: PriceBooksService) {}

  @Get()
  list(@Query() query: PriceBookListQueryDto) {
    return this.service.listPriceBooks(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: PriceBookCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createPriceBook(body, auditActor(user));
  }

  @Get(':priceBookId')
  get(
    @Param('priceBookId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getPriceBook(id, deleted === 'true');
  }

  @Patch(':priceBookId')
  update(
    @Param('priceBookId', new ParseUUIDPipe()) id: string,
    @Body() body: PriceBookUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updatePriceBook(id, body, auditActor(user));
  }

  @Delete(':priceBookId')
  remove(
    @Param('priceBookId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivatePriceBook(id, auditActor(user));
  }

  @Post(':priceBookId/reactivate')
  reactivate(
    @Param('priceBookId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivatePriceBook(id, auditActor(user));
  }
}
