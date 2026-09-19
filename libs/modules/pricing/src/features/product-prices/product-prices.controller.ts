import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductPriceCreateDto, ProductPriceListQueryDto } from './product-prices.schema';
import { auditActor } from '../../contracts/pricing-context';
import { ProductPricesService } from './product-prices.service';

@ApiTags('product-prices')
@Controller({ path: 'product-prices', version: '1' })
export class ProductPricesController {
  constructor(private readonly service: ProductPricesService) {}
  @Get() list(@Query() query: ProductPriceListQueryDto) {
    return this.service.listProductPrices(query);
  }
  @Post() @HttpCode(HttpStatus.CREATED) create(
    @Body() body: ProductPriceCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.createProductPrice(body, auditActor(user));
  }
}
