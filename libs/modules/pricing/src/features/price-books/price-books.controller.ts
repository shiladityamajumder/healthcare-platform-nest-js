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
// * Pricing module: Exposes price-book administration and lifecycle endpoints.
// * File: src/features/price-books/price-books.controller.ts
// ? Keep HTTP concerns at the controller boundary and delegate pricing rules to PriceBooksService.
// ! Do not bypass DTO validation, audit-context normalization, or the application service.
import {
  ApiPricingAuditHeader,
  ApiPricingBody,
  ApiPricingErrors,
  ApiPricingIncludeDeletedQuery,
  ApiPricingOperation,
  ApiPricingPaginatedResponse,
  ApiPricingQuery,
  ApiPricingResponse,
  ApiPricingUuidParam,
  ApiPricingValidationError,
} from '../../contracts/swagger';
import { PriceBooksService } from './price-books.service';

@ApiTags('price-books')
@Controller({ path: 'price-books', version: '1' })
@ApiPricingErrors({
  notFound: 'The requested price book does not exist or is not visible to the current operation.',
  conflict: 'The price book name or effective-date scope conflicts with an existing price book.',
  unavailable: 'The pricing database is temporarily unavailable. Retry using the request ID for support.',
  internal: 'An unexpected pricing failure occurred while processing the request.',
})
/** HTTP routes for price-book listing, maintenance, and lifecycle management. */
export class PriceBooksController {
  // * Function [constructor]: Initializes the controller with its feature service.
  constructor(private readonly service: PriceBooksService) {}

  // * Function [list]: Returns paginated price books for pricing-context selection.
  @Get()
  @ApiPricingOperation('List price books', 'Returns paginated price books so the frontend can select the correct commercial price context for a channel, region, seller, or warehouse.')
  @ApiPricingQuery(PriceBookListQueryDto, 'Optional page, search, and lifecycle-status filters.')
  @ApiPricingPaginatedResponse('Price books returned.', [{
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Retail India Default',
    currency: 'INR',
    channel: 'web',
    status: 'active',
    rowVersion: 1,
  }])
  @ApiPricingValidationError()
  list(@Query() query: PriceBookListQueryDto) {
    return this.service.listPriceBooks(query);
  }

  // * Function [create]: Creates an effective-dated price book from the validated request body.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiPricingOperation('Create a price book', 'Creates an effective-dated price book that can receive product prices for a sales channel and optional commercial scope.')
  @ApiPricingBody(PriceBookCreateDto, 'Price-book name, currency, channel, scope, validity window, priority, and initial status.')
  @ApiPricingResponse('Price book created.', { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Retail India Default', status: 'draft', rowVersion: 1 }, HttpStatus.CREATED)
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  create(@Body() body: PriceBookCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createPriceBook(body, auditActor(user));
  }

  // * Function [get]: Retrieves one price book, optionally including soft-deleted history.
  @Get(':priceBookId')
  @ApiPricingOperation('Get a price book', 'Returns one price book and its current lifecycle/version state for administration or pricing-context selection.')
  @ApiPricingUuidParam('priceBookId', 'Price-book UUID to retrieve.')
  @ApiPricingIncludeDeletedQuery()
  @ApiPricingResponse('Price book returned.', { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Retail India Default', currency: 'INR', status: 'active', rowVersion: 1 })
  @ApiPricingValidationError()
  get(
    @Param('priceBookId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getPriceBook(id, deleted === 'true');
  }

  // * Function [update]: Updates mutable price-book fields using the supplied row version.
  @Patch(':priceBookId')
  @ApiPricingOperation('Update a price book', 'Updates mutable price-book fields using optimistic locking so concurrent operator changes are not silently overwritten.')
  @ApiPricingUuidParam('priceBookId', 'Price-book UUID to update.')
  @ApiPricingBody(PriceBookUpdateDto, 'One or more mutable fields and the current rowVersion.')
  @ApiPricingResponse('Price book updated.', { id: '550e8400-e29b-41d4-a716-446655440000', status: 'active', rowVersion: 2 })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  update(
    @Param('priceBookId', new ParseUUIDPipe()) id: string,
    @Body() body: PriceBookUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updatePriceBook(id, body, auditActor(user));
  }

  // * Function [remove]: Deactivates a price book without removing its historical record.
  @Delete(':priceBookId')
  @ApiPricingOperation('Deactivate a price book', 'Soft-deactivates a price book so it is excluded from normal pricing selection while preserving its history.')
  @ApiPricingUuidParam('priceBookId', 'Price-book UUID to deactivate.')
  @ApiPricingResponse('Price book deactivated.', { message: 'The price book has been deactivated.' })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  remove(
    @Param('priceBookId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivatePriceBook(id, auditActor(user));
  }

  // * Function [reactivate]: Restores a previously deactivated price book for review.
  @Post(':priceBookId/reactivate')
  @ApiPricingOperation('Reactivate a price book', 'Restores a soft-deleted price book as inactive so an operator can review it before activating it again.')
  @ApiPricingUuidParam('priceBookId', 'Price-book UUID to reactivate.')
  @ApiPricingResponse('Price book reactivated.', { id: '550e8400-e29b-41d4-a716-446655440000', status: 'inactive', rowVersion: 3 })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  reactivate(
    @Param('priceBookId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivatePriceBook(id, auditActor(user));
  }
}
