// * Pricing module: Exposes promotion, version, coupon, redemption, and evaluation endpoints.
// * File: src/features/promotions/promotions.controller.ts
// ? Keep transport concerns at the controller boundary and delegate workflows to PromotionsService.
// ! Do not bypass DTO validation, audit-context normalization, or promotion lifecycle rules.
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
  CouponCodeCreateDto,
  CouponCodeListQueryDto,
  CouponCodeUpdateDto,
  PricingEvaluationCreateDto,
  PricingEvaluationListQueryDto,
  PromotionCreateDto,
  PromotionListQueryDto,
  PromotionRedemptionCreateDto,
  PromotionRedemptionListQueryDto,
  PromotionUpdateDto,
  PromotionVersionCreateDto,
  PromotionVersionListQueryDto,
} from './promotions.schema';
import { auditActor } from '../../contracts/pricing-context';
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
import { PromotionsService } from './promotions.service';

@ApiTags('promotions')
@Controller({ path: 'promotions', version: '1' })
@ApiPricingErrors({
  notFound: 'The requested promotion or promotion version does not exist.',
  conflict: 'The promotion code, version number, or requested lifecycle change conflicts with existing pricing state.',
  unavailable: 'The pricing database is temporarily unavailable. Retry using the request ID for support.',
  internal: 'An unexpected promotion-processing failure occurred.',
})
/** HTTP routes for promotion definitions and version lifecycle management. */
export class PromotionsController {
  // * Function [constructor]: Initializes the controller with the shared promotion service.
  constructor(private readonly service: PromotionsService) {}

  // * Function [list]: Returns paginated promotion definitions for selection or administration.
  @Get()
  @ApiPricingOperation('List promotions', 'Returns paginated promotions for administration or promotion selection, with optional status and effective-time filtering.')
  @ApiPricingQuery(PromotionListQueryDto, 'Optional search, status, effective-at, page, and page-size filters.')
  @ApiPricingPaginatedResponse('Promotions returned.', [{ id: '550e8400-e29b-41d4-a716-446655440004', code: 'WELCOME10', name: 'Welcome discount', status: 'active', priority: 10, rowVersion: 1 }])
  @ApiPricingValidationError()
  list(@Query() query: PromotionListQueryDto) {
    return this.service.listPromotions(query);
  }

  // * Function [create]: Creates a promotion definition from the validated request body.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiPricingOperation('Create a promotion', 'Creates a promotion definition that can later receive versioned rules and benefits for checkout evaluation.')
  @ApiPricingBody(PromotionCreateDto, 'Promotion code, type, limits, stackability, validity window, lifecycle status, and exclusivity.')
  @ApiPricingResponse('Promotion created.', { id: '550e8400-e29b-41d4-a716-446655440004', code: 'WELCOME10', status: 'draft', rowVersion: 1 }, HttpStatus.CREATED)
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  create(@Body() body: PromotionCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createPromotion(body, auditActor(user));
  }

  // * Function [versions]: Lists the version history for one promotion.
  @Get(':promotionId/versions')
  @ApiPricingOperation('List promotion versions', 'Returns the version history for one promotion so operators can inspect drafts and published pricing rules.')
  @ApiPricingUuidParam('promotionId', 'Promotion UUID whose versions should be listed.')
  @ApiPricingQuery(PromotionVersionListQueryDto, 'Optional published-only and pagination filters.')
  @ApiPricingPaginatedResponse('Promotion versions returned.', [{ id: '550e8400-e29b-41d4-a716-446655440007', promotionId: '550e8400-e29b-41d4-a716-446655440004', versionNo: 1, publishedAt: null, rowVersion: 1 }])
  @ApiPricingValidationError()
  versions(
    @Param('promotionId', new ParseUUIDPipe()) promotionId: string,
    @Query() query: PromotionVersionListQueryDto,
  ) {
    return this.service.listPromotionVersions(promotionId, query);
  }

  // * Function [createVersion]: Creates a versioned rules-and-benefits snapshot.
  @Post(':promotionId/versions')
  @HttpCode(HttpStatus.CREATED)
  @ApiPricingOperation('Create a promotion version', 'Creates a versioned rules-and-benefits snapshot for a promotion, allowing pricing logic to evolve without rewriting history.')
  @ApiPricingUuidParam('promotionId', 'Promotion UUID receiving the new version.')
  @ApiPricingBody(PromotionVersionCreateDto, 'Version number, pricing rules, benefits, and optional publish timestamp.')
  @ApiPricingResponse('Promotion version created.', { id: '550e8400-e29b-41d4-a716-446655440007', promotionId: '550e8400-e29b-41d4-a716-446655440004', versionNo: 1, publishedAt: null, rowVersion: 1 }, HttpStatus.CREATED)
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  createVersion(
    @Param('promotionId', new ParseUUIDPipe()) promotionId: string,
    @Body() body: PromotionVersionCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.createPromotionVersion(promotionId, body, auditActor(user));
  }

  // * Function [getVersion]: Retrieves one promotion version for audit or administration.
  @Get(':promotionId/versions/:versionId')
  @ApiPricingOperation('Get a promotion version', 'Returns one immutable rules-and-benefits version for administration or pricing audit inspection.')
  @ApiPricingUuidParam('promotionId', 'Parent promotion UUID in the route.')
  @ApiPricingUuidParam('versionId', 'Promotion-version UUID to retrieve.')
  @ApiPricingResponse('Promotion version returned.', { id: '550e8400-e29b-41d4-a716-446655440007', promotionId: '550e8400-e29b-41d4-a716-446655440004', versionNo: 1, rules: { minimumOrderValue: '999.00' }, benefits: { discountPercent: 10 }, publishedAt: '2026-01-01T00:00:00.000Z', rowVersion: 2 })
  @ApiPricingValidationError()
  getVersion(@Param('versionId', new ParseUUIDPipe()) versionId: string) {
    return this.service.getPromotionVersion(versionId);
  }

  // * Function [publishVersion]: Publishes one promotion version for pricing evaluation.
  @Post(':promotionId/versions/:versionId/publish')
  @ApiPricingOperation('Publish a promotion version', 'Marks a promotion version as published so the pricing engine can use its rules and benefits.')
  @ApiPricingUuidParam('promotionId', 'Parent promotion UUID in the route.')
  @ApiPricingUuidParam('versionId', 'Promotion-version UUID to publish.')
  @ApiPricingResponse('Promotion version published.', { id: '550e8400-e29b-41d4-a716-446655440007', publishedAt: '2026-01-01T00:00:00.000Z', rowVersion: 2 })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  publishVersion(
    @Param('versionId', new ParseUUIDPipe()) versionId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.publishPromotionVersion(versionId, auditActor(user));
  }

  // * Function [get]: Retrieves one promotion, optionally including soft-deleted history.
  @Get(':promotionId')
  @ApiPricingOperation('Get a promotion', 'Returns one promotion definition and its lifecycle/version state for administration or eligibility preparation.')
  @ApiPricingUuidParam('promotionId', 'Promotion UUID to retrieve.')
  @ApiPricingIncludeDeletedQuery()
  @ApiPricingResponse('Promotion returned.', { id: '550e8400-e29b-41d4-a716-446655440004', code: 'WELCOME10', name: 'Welcome discount', status: 'active', rowVersion: 1 })
  @ApiPricingValidationError()
  get(
    @Param('promotionId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getPromotion(id, deleted === 'true');
  }

  // * Function [update]: Updates mutable promotion metadata using optimistic locking.
  @Patch(':promotionId')
  @ApiPricingOperation('Update a promotion', 'Updates mutable promotion metadata and limits using optimistic locking while preserving its version history.')
  @ApiPricingUuidParam('promotionId', 'Promotion UUID to update.')
  @ApiPricingBody(PromotionUpdateDto, 'Mutable promotion fields and the current rowVersion.')
  @ApiPricingResponse('Promotion updated.', { id: '550e8400-e29b-41d4-a716-446655440004', code: 'WELCOME15', status: 'active', rowVersion: 2 })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  update(
    @Param('promotionId', new ParseUUIDPipe()) id: string,
    @Body() body: PromotionUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updatePromotion(id, body, auditActor(user));
  }

  // * Function [remove]: Deactivates a promotion while preserving its history.
  @Delete(':promotionId')
  @ApiPricingOperation('Deactivate a promotion', 'Soft-deactivates a promotion so it is excluded from normal promotion selection while preserving its audit history.')
  @ApiPricingUuidParam('promotionId', 'Promotion UUID to deactivate.')
  @ApiPricingResponse('Promotion deactivated.', { message: 'The promotion has been deactivated.' })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  remove(
    @Param('promotionId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivatePromotion(id, auditActor(user));
  }

  // * Function [reactivate]: Restores a deleted promotion as inactive.
  @Post(':promotionId/reactivate')
  @ApiPricingOperation('Reactivate a promotion', 'Restores a soft-deleted promotion as inactive so an operator can review it before activating it.')
  @ApiPricingUuidParam('promotionId', 'Promotion UUID to reactivate.')
  @ApiPricingResponse('Promotion reactivated.', { id: '550e8400-e29b-41d4-a716-446655440004', status: 'inactive', rowVersion: 3 })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  reactivate(
    @Param('promotionId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivatePromotion(id, auditActor(user));
  }
}

@ApiTags('coupon-codes')
@Controller({ path: 'coupon-codes', version: '1' })
@ApiPricingErrors({
  notFound: 'The requested coupon code or parent promotion does not exist.',
  conflict: 'The coupon code already exists or the requested lifecycle change conflicts with current state.',
  unavailable: 'The pricing database is temporarily unavailable. Retry using the request ID for support.',
  internal: 'An unexpected coupon-processing failure occurred.',
})
/** HTTP routes for coupon-code creation, maintenance, and lifecycle management. */
export class CouponCodesController {
  // * Function [constructor]: Initializes the controller with the shared promotion service.
  constructor(private readonly service: PromotionsService) {}

  // * Function [list]: Returns paginated coupon codes and validity filters.
  @Get()
  @ApiPricingOperation('List coupon codes', 'Returns paginated coupon codes for administration, assignment, and validity-window inspection.')
  @ApiPricingQuery(CouponCodeListQueryDto, 'Optional promotion, assigned-user, search, effective-time, and pagination filters.')
  @ApiPricingPaginatedResponse('Coupon codes returned.', [{ id: '550e8400-e29b-41d4-a716-446655440008', promotionId: '550e8400-e29b-41d4-a716-446655440004', code: 'WELCOME2026', isActive: true, rowVersion: 1 }])
  @ApiPricingValidationError()
  list(@Query() query: CouponCodeListQueryDto) {
    return this.service.listCouponCodes(query);
  }

  // * Function [create]: Creates a unique coupon code linked to a promotion.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiPricingOperation('Create a coupon code', 'Creates a unique coupon code linked to a promotion with optional user assignment, redemption limit, and validity dates.')
  @ApiPricingBody(CouponCodeCreateDto, 'Parent promotion, code, redemption limit, assignment, validity window, and active flag.')
  @ApiPricingResponse('Coupon code created.', { id: '550e8400-e29b-41d4-a716-446655440008', code: 'WELCOME2026', isActive: true, rowVersion: 1 }, HttpStatus.CREATED)
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  create(@Body() body: CouponCodeCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createCouponCode(body, auditActor(user));
  }

  // * Function [get]: Retrieves one coupon code, optionally including soft-deleted history.
  @Get(':couponCodeId')
  @ApiPricingOperation('Get a coupon code', 'Returns one coupon code and its current assignment, validity, active state, and row version.')
  @ApiPricingUuidParam('couponCodeId', 'Coupon-code UUID to retrieve.')
  @ApiPricingIncludeDeletedQuery()
  @ApiPricingResponse('Coupon code returned.', { id: '550e8400-e29b-41d4-a716-446655440008', code: 'WELCOME2026', isActive: true, rowVersion: 1 })
  @ApiPricingValidationError()
  get(
    @Param('couponCodeId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getCouponCode(id, deleted === 'true');
  }

  // * Function [update]: Updates mutable coupon fields using optimistic locking.
  @Patch(':couponCodeId')
  @ApiPricingOperation('Update a coupon code', 'Updates coupon assignment, limits, validity, or active state using optimistic locking.')
  @ApiPricingUuidParam('couponCodeId', 'Coupon-code UUID to update.')
  @ApiPricingBody(CouponCodeUpdateDto, 'Mutable coupon fields and the current rowVersion.')
  @ApiPricingResponse('Coupon code updated.', { id: '550e8400-e29b-41d4-a716-446655440008', isActive: false, rowVersion: 2 })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  update(
    @Param('couponCodeId', new ParseUUIDPipe()) id: string,
    @Body() body: CouponCodeUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateCouponCode(id, body, auditActor(user));
  }

  // * Function [remove]: Deactivates a coupon code while preserving redemption history.
  @Delete(':couponCodeId')
  @ApiPricingOperation('Deactivate a coupon code', 'Soft-deactivates a coupon code so it cannot be selected while preserving redemption and audit history.')
  @ApiPricingUuidParam('couponCodeId', 'Coupon-code UUID to deactivate.')
  @ApiPricingResponse('Coupon code deactivated.', { message: 'The coupon code has been deactivated.' })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  remove(
    @Param('couponCodeId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.deactivateCouponCode(id, auditActor(user));
  }

  // * Function [reactivate]: Restores a deleted coupon code as active.
  @Post(':couponCodeId/reactivate')
  @ApiPricingOperation('Reactivate a coupon code', 'Restores a soft-deleted coupon code as active for future eligibility checks.')
  @ApiPricingUuidParam('couponCodeId', 'Coupon-code UUID to reactivate.')
  @ApiPricingResponse('Coupon code reactivated.', { id: '550e8400-e29b-41d4-a716-446655440008', isActive: true, rowVersion: 3 })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  reactivate(
    @Param('couponCodeId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateCouponCode(id, auditActor(user));
  }
}

@ApiTags('promotion-redemptions')
@Controller({ path: 'promotion-redemptions', version: '1' })
@ApiPricingErrors({
  notFound: 'The promotion referenced by the redemption or the requested redemption record does not exist.',
  conflict: 'The idempotency key has already been used for a redemption.',
  unavailable: 'The pricing database is temporarily unavailable. Retry using the request ID for support.',
  internal: 'An unexpected redemption-processing failure occurred.',
})
/** HTTP routes for promotion-redemption recording and reconciliation. */
export class PromotionRedemptionsController {
  // * Function [constructor]: Initializes the controller with the shared promotion service.
  constructor(private readonly service: PromotionsService) {}

  // * Function [list]: Returns redemption history for reconciliation and support workflows.
  @Get()
  @ApiPricingOperation('List promotion redemptions', 'Returns paginated redemption records for order, user, promotion, reconciliation, and audit views.')
  @ApiPricingQuery(PromotionRedemptionListQueryDto, 'Optional promotion, user, order, and pagination filters.')
  @ApiPricingPaginatedResponse('Promotion redemptions returned.', [{ id: '550e8400-e29b-41d4-a716-446655440011', promotionId: '550e8400-e29b-41d4-a716-446655440004', userId: '550e8400-e29b-41d4-a716-446655440005', discountAmount: '100.00', idempotencyKey: 'checkout-order-10001-promo-WELCOME10' }])
  @ApiPricingValidationError()
  list(@Query() query: PromotionRedemptionListQueryDto) {
    return this.service.listPromotionRedemptions(query);
  }

  // * Function [create]: Records a promotion redemption with idempotency protection.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiPricingOperation('Record a promotion redemption', 'Records the promotion benefit applied to a user/order and uses the idempotency key to prevent duplicate redemption records.')
  @ApiPricingBody(PromotionRedemptionCreateDto, 'Promotion, optional version/coupon/order references, user, discount amount, redemption time, and idempotency key.')
  @ApiPricingResponse('Promotion redemption recorded.', { id: '550e8400-e29b-41d4-a716-446655440011', promotionId: '550e8400-e29b-41d4-a716-446655440004', discountAmount: '100.00', redeemedAt: '2026-06-01T12:00:00.000Z' }, HttpStatus.CREATED)
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  create(@Body() body: PromotionRedemptionCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createPromotionRedemption(body, auditActor(user));
  }

  // * Function [get]: Retrieves one promotion redemption record.
  @Get(':redemptionId')
  @ApiPricingOperation('Get a promotion redemption', 'Returns one redemption record for checkout confirmation, customer support, or reconciliation.')
  @ApiPricingUuidParam('redemptionId', 'Promotion-redemption UUID to retrieve.')
  @ApiPricingResponse('Promotion redemption returned.', { id: '550e8400-e29b-41d4-a716-446655440011', promotionId: '550e8400-e29b-41d4-a716-446655440004', discountAmount: '100.00', redeemedAt: '2026-06-01T12:00:00.000Z' })
  @ApiPricingValidationError()
  get(@Param('redemptionId', new ParseUUIDPipe()) id: string) {
    return this.service.getPromotionRedemption(id);
  }
}

@ApiTags('pricing-evaluations')
@Controller({ path: 'pricing-evaluations', version: '1' })
@ApiPricingErrors({
  notFound: 'The requested pricing evaluation does not exist.',
  unavailable: 'The pricing database is temporarily unavailable. Retry using the request ID for support.',
  internal: 'An unexpected pricing-evaluation failure occurred.',
})
/** HTTP routes for pricing-engine evaluation snapshots and diagnostics. */
export class PricingEvaluationsController {
  // * Function [constructor]: Initializes the controller with the shared promotion service.
  constructor(private readonly service: PromotionsService) {}

  // * Function [list]: Returns pricing-engine audit snapshots with pagination.
  @Get()
  @ApiPricingOperation('List pricing evaluations', 'Returns pricing-engine request/response snapshots for troubleshooting, audit, and price-calculation observability.')
  @ApiPricingQuery(PricingEvaluationListQueryDto, 'Optional reference, user, and pagination filters.')
  @ApiPricingPaginatedResponse('Pricing evaluations returned.', [{ id: '550e8400-e29b-41d4-a716-446655440012', referenceType: 'order', referenceId: '550e8400-e29b-41d4-a716-446655440006', ruleVersion: 'promotion-v3' }])
  @ApiPricingValidationError()
  list(@Query() query: PricingEvaluationListQueryDto) {
    return this.service.listPricingEvaluations(query);
  }

  // * Function [create]: Records a pricing request and response snapshot.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiPricingOperation('Record a pricing evaluation', 'Stores the input and output snapshots of a pricing calculation so checkout results can be audited and diagnosed later.')
  @ApiPricingBody(PricingEvaluationCreateDto, 'Reference identity, optional user, pricing request snapshot, response snapshot, and rule version.')
  @ApiPricingResponse('Pricing evaluation recorded.', { id: '550e8400-e29b-41d4-a716-446655440012', referenceType: 'order', referenceId: '550e8400-e29b-41d4-a716-446655440006', ruleVersion: 'promotion-v3' }, HttpStatus.CREATED)
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  create(@Body() body: PricingEvaluationCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createPricingEvaluation(body, auditActor(user));
  }

  // * Function [get]: Retrieves one pricing evaluation audit record.
  @Get(':evaluationId')
  @ApiPricingOperation('Get a pricing evaluation', 'Returns one pricing request/response snapshot for support, reconciliation, or pricing-rule diagnostics.')
  @ApiPricingUuidParam('evaluationId', 'Pricing-evaluation UUID to retrieve.')
  @ApiPricingResponse('Pricing evaluation returned.', { id: '550e8400-e29b-41d4-a716-446655440012', referenceType: 'order', referenceId: '550e8400-e29b-41d4-a716-446655440006', requestPayload: { subtotal: '998.00' }, responseSnapshot: { total: '898.00' }, ruleVersion: 'promotion-v3' })
  @ApiPricingValidationError()
  get(@Param('evaluationId', new ParseUUIDPipe()) id: string) {
    return this.service.getPricingEvaluation(id);
  }
}
