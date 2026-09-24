// * Pricing module: Exposes effective-dated product-price retrieval and creation endpoints.
// * File: src/features/product-prices/product-prices.controller.ts
// ? Keep transport concerns here and delegate price validation and overlap checks to ProductPricesService.
// ! Do not perform pricing calculations or direct persistence operations in this controller.
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductPriceCreateDto, ProductPriceListQueryDto } from './product-prices.schema';
import { auditActor } from '../../contracts/pricing-context';
import {
  ApiPricingAuditHeader,
  ApiPricingBody,
  ApiPricingErrors,
  ApiPricingOperation,
  ApiPricingPaginatedResponse,
  ApiPricingQuery,
  ApiPricingResponse,
  ApiPricingUuidParam,
  ApiPricingValidationError,
} from '../../contracts/swagger';
import { ProductPricesService } from './product-prices.service';

@ApiTags('product-prices')
@Controller({ path: 'product-prices', version: '1' })
@ApiPricingErrors({
  notFound: 'The requested product, variant, price book, or product-price record does not exist.',
  conflict: 'The product price overlaps another effective price for the same product scope.',
  unavailable: 'The pricing database is temporarily unavailable. Retry using the request ID for support.',
  internal: 'An unexpected pricing failure occurred while processing the request.',
})
/** HTTP routes for product-price listing, creation, and detail retrieval. */
export class ProductPricesController {
  // * Function [constructor]: Initializes the controller with its feature service.
  constructor(private readonly service: ProductPricesService) {}

  // * Function [list]: Returns paginated product prices using optional product and price-book filters.
  @Get()
  @ApiPricingOperation('List product prices', 'Returns paginated effective-dated prices so checkout, catalog, and administration screens can resolve prices for products and optional variants.')
  @ApiPricingQuery(ProductPriceListQueryDto, 'Optional product, price-book, effective-at, page, and page-size filters.')
  @ApiPricingPaginatedResponse('Product prices returned.', [{
    id: '550e8400-e29b-41d4-a716-446655440009',
    productId: '550e8400-e29b-41d4-a716-446655440002',
    sellingPrice: '449.00',
    currency: 'INR',
    rowVersion: 1,
  }])
  @ApiPricingValidationError()
  list(@Query() query: ProductPriceListQueryDto) {
    return this.service.listProductPrices(query);
  }

  // * Function [create]: Creates a validated, non-overlapping effective-dated product price.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiPricingOperation('Create a product price', 'Creates a non-overlapping effective-dated price for a product or variant inside a price book.')
  @ApiPricingBody(ProductPriceCreateDto, 'Price-book/product scope, MRP, selling price, optional cost price, validity window, and source.')
  @ApiPricingResponse('Product price created.', { id: '550e8400-e29b-41d4-a716-446655440009', sellingPrice: '449.00', rowVersion: 1 }, HttpStatus.CREATED)
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  create(
    @Body() body: ProductPriceCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.createProductPrice(body, auditActor(user));
  }

  // * Function [get]: Retrieves one product-price record with its price-book context.
  @Get(':productPriceId')
  @ApiPricingOperation('Get a product price', 'Returns one product-price record together with its price-book context for detail views and audit inspection.')
  @ApiPricingUuidParam('productPriceId', 'Product-price UUID to retrieve.')
  @ApiPricingResponse('Product price returned.', { id: '550e8400-e29b-41d4-a716-446655440009', productId: '550e8400-e29b-41d4-a716-446655440002', sellingPrice: '449.00', currency: 'INR', rowVersion: 1 })
  @ApiPricingValidationError()
  get(@Param('productPriceId', new ParseUUIDPipe()) id: string) {
    return this.service.getProductPrice(id);
  }
}
