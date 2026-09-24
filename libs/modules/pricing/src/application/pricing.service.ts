// * Pricing module: Coordinates pricing use cases across price books, product prices, promotions, and tax rules.
// * File: src/application/pricing.service.ts
// ? Keep business validation, transaction boundaries, and application orchestration in this layer.
// ! Do not move transport decorators or SQL statements into the application service.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion */
import { Inject, Injectable } from '@nestjs/common';
import { ConflictError } from '@shared/errors';
import type {
  PriceBookCreateInput,
  PriceBookListQuery,
  PriceBookUpdateInput,
  PromotionCreateInput,
  PromotionListQuery,
  PromotionRedemptionCreateInput,
  PromotionRedemptionListQuery,
  PromotionUpdateInput,
  PromotionVersionCreateInput,
  PromotionVersionListQuery,
  PricingEvaluationCreateInput,
  PricingEvaluationListQuery,
  PricingRepositoryPort,
  CouponCodeCreateInput,
  CouponCodeListQuery,
  CouponCodeUpdateInput,
  ProductPriceCreateInput,
  ProductPriceListQuery,
  TaxRuleCreateInput,
  TaxRuleListQuery,
  TaxRuleUpdateInput,
} from '../contracts/pricing.ports';
import { PRICING_REPOSITORY } from '../contracts/pricing.ports';
import {
  PricingConflictError,
  PricingNotFoundError,
  PricingValidationError,
} from '../contracts/pricing.errors';
import { validateDateWindow, validateProductPrice, validateRate } from '../contracts/pricing.rules';

type Row = Record<string, any>;

@Injectable()
/** Application service for pricing workflows and effective-dated commercial rules. */
export class PricingService {
  // * Function [constructor]: Initializes the component with its required repository boundary.
  constructor(@Inject(PRICING_REPOSITORY) private readonly repository: PricingRepositoryPort) {}

  // * Function [listPriceBooks]: Retrieves paginated price-book data for the requested pricing scope.
  async listPriceBooks(query: PriceBookListQuery) {
    const result = await this.repository.listPriceBooks(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  // * Function [createPriceBook]: Validates and creates a unique effective-dated price book.
  async createPriceBook(input: PriceBookCreateInput, actor: string | null) {
    validateDateWindow(input.validFrom, input.validUntil, false);
    return this.repository.transaction(async () => {
      if (input.warehouseId && !(await this.repository.warehouseExists(input.warehouseId))) {
        throw new PricingNotFoundError('WAREHOUSE_NOT_FOUND', 'The warehouse was not found.');
      }
      if (input.sellerId && !(await this.repository.sellerExists(input.sellerId))) {
        throw new PricingNotFoundError('SELLER_NOT_FOUND', 'The seller was not found.');
      }
      const values = {
        ...input,
        name: input.name.trim(),
        currency: input.currency.toUpperCase(),
        channel: input.channel.toLowerCase(),
        regionCode: input.regionCode?.toUpperCase(),
      };
      await this.repository.lockPriceBookScope(
        values.name,
        values.channel,
        values.regionCode ?? null,
        values.sellerId ?? null,
        values.warehouseId ?? null,
      );
      if (
        await this.repository.priceBookNameExists(
          values.name,
          values.channel,
          values.regionCode ?? null,
          values.sellerId ?? null,
          values.warehouseId ?? null,
        )
      ) {
        throw new PricingConflictError(
          'PRICE_BOOK_ALREADY_EXISTS',
          'An active price book with the same name and scope already exists.',
        );
      }
      return mapPriceBook(await this.repository.createPriceBook(values, actor));
    });
  }

  // * Function [getPriceBook]: Retrieves one price book, optionally including soft-deleted history.
  async getPriceBook(id: string, includeDeleted = false) {
    const row = await this.repository.getPriceBook(id, includeDeleted);
    if (!row)
      throw new PricingNotFoundError('PRICE_BOOK_NOT_FOUND', 'The price book was not found.');
    return mapPriceBook(row);
  }

  // * Function [updatePriceBook]: Applies an optimistic-locked price-book update.
  async updatePriceBook(id: string, input: PriceBookUpdateInput, actor: string | null) {
    return this.repository.transaction(async () => {
      const current = await this.repository.getPriceBook(id, false, true);
      if (!current)
        throw new PricingNotFoundError('PRICE_BOOK_NOT_FOUND', 'The price book was not found.');
      if (Number(current.row_version) !== input.rowVersion) versionConflict(current.row_version);
      const values = patchValues(input as Row, ['rowVersion']);
      if (!Object.keys(values).length)
        throw new PricingValidationError('At least one mutable field must be provided.');
      const nextFrom = (values.validFrom as Date | undefined) ?? current.valid_from;
      const nextUntil = Object.prototype.hasOwnProperty.call(values, 'validUntil')
        ? (values.validUntil as Date | null)
        : current.valid_until;
      validateDateWindow(nextFrom, nextUntil, false);
      if (values.name) values.name = String(values.name).trim();
      if (values.name) {
        await this.repository.lockPriceBookScope(
          String(values.name),
          String(current.channel),
          current.region_code,
          current.seller_id,
          current.warehouse_id,
        );
        if (
          await this.repository.priceBookNameExists(
            String(values.name),
            String(current.channel),
            current.region_code,
            current.seller_id,
            current.warehouse_id,
            id,
          )
        ) {
          throw new PricingConflictError(
            'PRICE_BOOK_ALREADY_EXISTS',
            'An active price book with the same name and scope already exists.',
          );
        }
      }
      const row = await this.repository.updatePriceBook(
        id,
        values,
        actor,
        Number(current.row_version),
      );
      if (!row) versionConflict(current.row_version);
      return row;
    });
  }

  // * Function [deactivatePriceBook]: Soft-deletes a price book while retaining its audit history.
  async deactivatePriceBook(id: string, actor: string | null) {
    return this.repository.transaction(async () => {
      if (!(await this.repository.deactivatePriceBook(id, actor)))
        throw new PricingNotFoundError('PRICE_BOOK_NOT_FOUND', 'The price book was not found.');
      return { message: 'The price book has been deactivated.' };
    });
  }

  // * Function [reactivatePriceBook]: Restores a deleted price book after rechecking its unique scope.
  async reactivatePriceBook(id: string, actor: string | null) {
    return this.repository.transaction(async () => {
      const current = await this.repository.getPriceBook(id, true, true);
      if (!current)
        throw new PricingNotFoundError('PRICE_BOOK_NOT_FOUND', 'The price book was not found.');
      if (!current.is_deleted) throw new ConflictError('The price book is already active.');
      await this.repository.lockPriceBookScope(
        current.name,
        current.channel,
        current.region_code,
        current.seller_id,
        current.warehouse_id,
      );
      if (
        await this.repository.priceBookNameExists(
          current.name,
          current.channel,
          current.region_code,
          current.seller_id,
          current.warehouse_id,
          id,
        )
      ) {
        throw new PricingConflictError(
          'PRICE_BOOK_ALREADY_EXISTS',
          'The price-book name and scope are now in use.',
        );
      }
      return this.repository.reactivatePriceBook(id, actor);
    });
  }

  // * Function [listProductPrices]: Retrieves paginated effective-dated product prices.
  async listProductPrices(query: ProductPriceListQuery) {
    const result = await this.repository.listProductPrices(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  // * Function [createProductPrice]: Validates and creates a non-overlapping product price.
  async createProductPrice(input: ProductPriceCreateInput, actor: string | null) {
    validateProductPrice(input.mrp, input.sellingPrice, input.costPrice);
    validateDateWindow(input.validFrom, input.validUntil, false);
    return this.repository.transaction(async () => {
      const book = await this.repository.getPriceBook(input.priceBookId);
      if (!book)
        throw new PricingNotFoundError('PRICE_BOOK_NOT_FOUND', 'The price book was not found.');
      if (!(await this.repository.productExists(input.productId)))
        throw new PricingNotFoundError('PRODUCT_NOT_FOUND', 'The product was not found.');
      if (
        input.variantId &&
        !(await this.repository.variantMatches(input.variantId, input.productId))
      )
        throw new PricingValidationError('The variant does not belong to the product.');
      const values = { ...input, source: input.source.toLowerCase() };
      await this.repository.lockProductPriceScope(values);
      if (await this.repository.overlappingPriceExists(values))
        throw new PricingConflictError(
          'PRODUCT_PRICE_WINDOW_OVERLAP',
          'A product price already overlaps this effective date window.',
        );
      const row = await this.repository.createProductPrice(values, actor);
      return { ...mapProductPrice(row), priceBookName: book.name, currency: book.currency };
    });
  }

  // * Function [getProductPrice]: Retrieves one product-price record with its price-book context.
  async getProductPrice(id: string) {
    const row = await this.repository.getProductPrice(id);
    if (!row) throw new PricingNotFoundError('PRODUCT_PRICE_NOT_FOUND', 'The product price was not found.');
    return row;
  }

  // * Function [listPromotions]: Retrieves paginated promotion definitions for selection or administration.
  async listPromotions(query: PromotionListQuery) {
    const result = await this.repository.listPromotions(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  // * Function [createPromotion]: Validates and creates a promotion definition.
  async createPromotion(input: PromotionCreateInput, actor: string | null) {
    validateDateWindow(input.startsAt, input.endsAt, false);
    if (input.budgetAmount !== undefined && (!Number.isFinite(Number(input.budgetAmount)) || Number(input.budgetAmount) < 0))
      throw new PricingValidationError('budgetAmount must be a non-negative number.');
    if (input.usageLimit != null && input.perUserLimit != null && input.perUserLimit > input.usageLimit)
      throw new PricingValidationError('perUserLimit cannot exceed usageLimit.');
    return this.repository.transaction(async () => {
      if (await this.repository.promotionCodeExists(input.code.toUpperCase()))
        throw new PricingConflictError('PROMOTION_ALREADY_EXISTS', 'A promotion with this code already exists.');
      return this.repository.createPromotion(
        { ...input, code: input.code.toUpperCase(), status: input.status ?? 'draft' },
        actor,
      );
    });
  }

  // * Function [getPromotion]: Retrieves one promotion, optionally including soft-deleted history.
  async getPromotion(id: string, includeDeleted = false) {
    const row = await this.repository.getPromotion(id, includeDeleted);
    if (!row) throw new PricingNotFoundError('PROMOTION_NOT_FOUND', 'The promotion was not found.');
    return row;
  }

  // * Function [updatePromotion]: Applies an optimistic-locked promotion update.
  async updatePromotion(id: string, input: PromotionUpdateInput, actor: string | null) {
    return this.repository.transaction(async () => {
      const current = await this.repository.getPromotion(id, false, true);
      if (!current) throw new PricingNotFoundError('PROMOTION_NOT_FOUND', 'The promotion was not found.');
      if (Number(current.row_version) !== input.rowVersion) versionConflict(current.row_version);
      const values = patchValues(input as Row, ['rowVersion']);
      if (!Object.keys(values).length) throw new PricingValidationError('At least one mutable field must be provided.');
      const nextFrom = (values.startsAt as Date | undefined) ?? current.starts_at;
      const nextUntil = Object.prototype.hasOwnProperty.call(values, 'endsAt') ? values.endsAt : current.ends_at;
      validateDateWindow(nextFrom, nextUntil, false);
      if (values.code) {
        values.code = String(values.code).toUpperCase();
        if (await this.repository.promotionCodeExists(String(values.code), id))
          throw new PricingConflictError('PROMOTION_ALREADY_EXISTS', 'A promotion with this code already exists.');
      }
      if (values.budgetAmount !== undefined && values.budgetAmount !== null && (!Number.isFinite(Number(values.budgetAmount)) || Number(values.budgetAmount) < 0))
        throw new PricingValidationError('budgetAmount must be a non-negative number.');
      const usageLimit = values.usageLimit ?? current.usage_limit;
      const perUserLimit = values.perUserLimit ?? current.per_user_limit;
      if (usageLimit != null && perUserLimit != null && Number(perUserLimit) > Number(usageLimit))
        throw new PricingValidationError('perUserLimit cannot exceed usageLimit.');
      const row = await this.repository.updatePromotion(id, values, actor, Number(current.row_version));
      if (!row) versionConflict(current.row_version);
      return row;
    });
  }

  // * Function [deactivatePromotion]: Soft-deletes a promotion while retaining its audit history.
  async deactivatePromotion(id: string, actor: string | null) {
    if (!(await this.repository.deactivatePromotion(id, actor)))
      throw new PricingNotFoundError('PROMOTION_NOT_FOUND', 'The promotion was not found.');
    return { message: 'The promotion has been deactivated.' };
  }

  // * Function [reactivatePromotion]: Restores a deleted promotion as an inactive record.
  async reactivatePromotion(id: string, actor: string | null) {
    const row = await this.repository.reactivatePromotion(id, actor);
    if (!row) throw new PricingNotFoundError('PROMOTION_NOT_FOUND', 'The promotion was not found.');
    return row;
  }

  // * Function [listPromotionVersions]: Retrieves version history for one promotion.
  async listPromotionVersions(promotionId: string, query: PromotionVersionListQuery) {
    if (!(await this.repository.getPromotion(promotionId)))
      throw new PricingNotFoundError('PROMOTION_NOT_FOUND', 'The promotion was not found.');
    const result = await this.repository.listPromotionVersions(promotionId, query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  // * Function [createPromotionVersion]: Creates a versioned promotion rules-and-benefits snapshot.
  async createPromotionVersion(
    promotionId: string,
    input: Omit<PromotionVersionCreateInput, 'promotionId'>,
    actor: string | null,
  ) {
    if (!(await this.repository.getPromotion(promotionId)))
      throw new PricingNotFoundError('PROMOTION_NOT_FOUND', 'The promotion was not found.');
    if (await this.repository.promotionVersionExists(promotionId, input.versionNo))
      throw new PricingConflictError('PROMOTION_VERSION_ALREADY_EXISTS', 'This promotion version already exists.');
    return this.repository.createPromotionVersion({ ...input, promotionId } as PromotionVersionCreateInput, actor);
  }

  // * Function [getPromotionVersion]: Retrieves one promotion version for audit or administration.
  async getPromotionVersion(id: string) {
    const row = await this.repository.getPromotionVersion(id);
    if (!row) throw new PricingNotFoundError('PROMOTION_VERSION_NOT_FOUND', 'The promotion version was not found.');
    return row;
  }

  // * Function [publishPromotionVersion]: Publishes a promotion version for pricing evaluation.
  async publishPromotionVersion(id: string, actor: string | null) {
    const row = await this.repository.publishPromotionVersion(id, actor);
    if (!row) throw new PricingNotFoundError('PROMOTION_VERSION_NOT_FOUND', 'The promotion version was not found.');
    return row;
  }

  // * Function [listCouponCodes]: Retrieves paginated coupon-code records and validity filters.
  async listCouponCodes(query: CouponCodeListQuery) {
    const result = await this.repository.listCouponCodes(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  // * Function [createCouponCode]: Validates and creates a unique coupon code for a promotion.
  async createCouponCode(input: CouponCodeCreateInput, actor: string | null) {
    validateDateWindow(input.validFrom ?? new Date(0), input.validUntil, false);
    if (!(await this.repository.getPromotion(input.promotionId)))
      throw new PricingNotFoundError('PROMOTION_NOT_FOUND', 'The promotion was not found.');
    if (await this.repository.couponCodeExists(input.code.toUpperCase()))
      throw new PricingConflictError('COUPON_CODE_ALREADY_EXISTS', 'A coupon code with this value already exists.');
    return this.repository.createCouponCode({ ...input, code: input.code.toUpperCase() }, actor);
  }

  // * Function [getCouponCode]: Retrieves one coupon code, optionally including soft-deleted history.
  async getCouponCode(id: string, includeDeleted = false) {
    const row = await this.repository.getCouponCode(id, includeDeleted);
    if (!row) throw new PricingNotFoundError('COUPON_CODE_NOT_FOUND', 'The coupon code was not found.');
    return row;
  }

  // * Function [updateCouponCode]: Applies an optimistic-locked coupon-code update.
  async updateCouponCode(id: string, input: CouponCodeUpdateInput, actor: string | null) {
    return this.repository.transaction(async () => {
      const current = await this.repository.getCouponCode(id, false, true);
      if (!current) throw new PricingNotFoundError('COUPON_CODE_NOT_FOUND', 'The coupon code was not found.');
      if (Number(current.row_version) !== input.rowVersion) versionConflict(current.row_version);
      const values = patchValues(input as Row, ['rowVersion']);
      if (!Object.keys(values).length) throw new PricingValidationError('At least one mutable field must be provided.');
      const from = Object.prototype.hasOwnProperty.call(values, 'validFrom') ? values.validFrom : current.valid_from;
      const until = Object.prototype.hasOwnProperty.call(values, 'validUntil') ? values.validUntil : current.valid_until;
      validateDateWindow(from ?? new Date(0), until, false);
      if (values.code) {
        values.code = String(values.code).toUpperCase();
        if (await this.repository.couponCodeExists(String(values.code), id))
          throw new PricingConflictError('COUPON_CODE_ALREADY_EXISTS', 'A coupon code with this value already exists.');
      }
      const row = await this.repository.updateCouponCode(id, values, actor, Number(current.row_version));
      if (!row) versionConflict(current.row_version);
      return row;
    });
  }

  // * Function [deactivateCouponCode]: Soft-deletes a coupon code and disables redemption.
  async deactivateCouponCode(id: string, actor: string | null) {
    if (!(await this.repository.deactivateCouponCode(id, actor)))
      throw new PricingNotFoundError('COUPON_CODE_NOT_FOUND', 'The coupon code was not found.');
    return { message: 'The coupon code has been deactivated.' };
  }

  // * Function [reactivateCouponCode]: Restores a deleted coupon code as active.
  async reactivateCouponCode(id: string, actor: string | null) {
    const row = await this.repository.reactivateCouponCode(id, actor);
    if (!row) throw new PricingNotFoundError('COUPON_CODE_NOT_FOUND', 'The coupon code was not found.');
    return row;
  }

  // * Function [listPromotionRedemptions]: Retrieves redemption history for promotion reconciliation.
  async listPromotionRedemptions(query: PromotionRedemptionListQuery) {
    const result = await this.repository.listPromotionRedemptions(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  // * Function [createPromotionRedemption]: Records a promotion redemption with idempotency protection.
  async createPromotionRedemption(input: PromotionRedemptionCreateInput, actor: string | null) {
    if (!Number.isFinite(Number(input.discountAmount)) || Number(input.discountAmount) < 0)
      throw new PricingValidationError('discountAmount must be a non-negative number.');
    if (!(await this.repository.getPromotion(input.promotionId)))
      throw new PricingNotFoundError('PROMOTION_NOT_FOUND', 'The promotion was not found.');
    if (await this.repository.redemptionIdempotencyExists(input.idempotencyKey))
      throw new PricingConflictError('REDEMPTION_ALREADY_RECORDED', 'This redemption idempotency key was already used.');
    return this.repository.createPromotionRedemption(input, actor);
  }

  // * Function [getPromotionRedemption]: Retrieves one promotion redemption record.
  async getPromotionRedemption(id: string) {
    const row = await this.repository.getPromotionRedemption(id);
    if (!row) throw new PricingNotFoundError('REDEMPTION_NOT_FOUND', 'The promotion redemption was not found.');
    return row;
  }

  // * Function [listPricingEvaluations]: Retrieves pricing-engine audit snapshots with pagination.
  async listPricingEvaluations(query: PricingEvaluationListQuery) {
    const result = await this.repository.listPricingEvaluations(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  // * Function [createPricingEvaluation]: Persists a pricing request and response snapshot.
  async createPricingEvaluation(input: PricingEvaluationCreateInput, actor: string | null) {
    return this.repository.createPricingEvaluation(input, actor);
  }

  // * Function [getPricingEvaluation]: Retrieves one pricing evaluation audit record.
  async getPricingEvaluation(id: string) {
    const row = await this.repository.getPricingEvaluation(id);
    if (!row) throw new PricingNotFoundError('PRICING_EVALUATION_NOT_FOUND', 'The pricing evaluation was not found.');
    return row;
  }

  // * Function [listTaxRules]: Retrieves paginated effective-dated tax rules.
  async listTaxRules(query: TaxRuleListQuery) {
    const result = await this.repository.listTaxRules(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

  // * Function [createTaxRule]: Validates and creates a non-overlapping tax rule.
  async createTaxRule(input: TaxRuleCreateInput, actor: string | null) {
    validateRate(input.rate);
    validateDateWindow(
      new Date(input.validFrom),
      input.validUntil ? new Date(input.validUntil) : undefined,
      true,
    );
    const values = {
      ...input,
      taxCode: input.taxCode.toUpperCase(),
      countryCode: input.countryCode.toUpperCase(),
      stateCode: input.stateCode?.toUpperCase(),
    };
    return this.repository.transaction(async () => {
      await this.repository.lockTaxRuleScope(values);
      if (await this.repository.overlappingTaxRuleExists(values))
        throw new PricingConflictError(
          'TAX_RULE_WINDOW_OVERLAP',
          'A tax rule already overlaps this code, region, and effective date window.',
        );
      return this.repository.createTaxRule(values, actor);
    });
  }

  // * Function [getTaxRule]: Retrieves one tax rule, optionally including soft-deleted history.
  async getTaxRule(id: string, includeDeleted = false) {
    const row = await this.repository.getTaxRule(id, includeDeleted);
    if (!row) throw new PricingNotFoundError('TAX_RULE_NOT_FOUND', 'The tax rule was not found.');
    return mapTaxRule(row);
  }

  // * Function [updateTaxRule]: Applies an optimistic-locked tax-rule update.
  async updateTaxRule(id: string, input: TaxRuleUpdateInput, actor: string | null) {
    return this.repository.transaction(async () => {
      const current = await this.repository.getTaxRule(id, false, true);
      if (!current)
        throw new PricingNotFoundError('TAX_RULE_NOT_FOUND', 'The tax rule was not found.');
      if (Number(current.row_version) !== input.rowVersion) versionConflict(current.row_version);
      const values = patchValues(input as Row, ['rowVersion']);
      if (!Object.keys(values).length)
        throw new PricingValidationError('At least one mutable field must be provided.');
      if (values.rate !== undefined) validateRate(String(values.rate));
      const nextFrom = String(values.validFrom ?? current.valid_from);
      const nextUntil = Object.prototype.hasOwnProperty.call(values, 'validUntil')
        ? (values.validUntil as string | null)
        : current.valid_until;
      validateDateWindow(new Date(nextFrom), nextUntil ? new Date(nextUntil) : undefined, true);
      const overlap = {
        taxCode: current.tax_code,
        countryCode: current.country_code,
        stateCode: current.state_code,
        validFrom: nextFrom,
        validUntil: nextUntil,
      };
      await this.repository.lockTaxRuleScope(overlap);
      if (await this.repository.overlappingTaxRuleExists(overlap, id))
        throw new PricingConflictError(
          'TAX_RULE_WINDOW_OVERLAP',
          'A tax rule already overlaps this code, region, and effective date window.',
        );
      const row = await this.repository.updateTaxRule(
        id,
        values,
        actor,
        Number(current.row_version),
      );
      if (!row) versionConflict(current.row_version);
      return row;
    });
  }

  // * Function [deactivateTaxRule]: Soft-deletes a tax rule while retaining its history.
  async deactivateTaxRule(id: string, actor: string | null) {
    return this.repository.transaction(async () => {
      if (!(await this.repository.deactivateTaxRule(id, actor)))
        throw new PricingNotFoundError('TAX_RULE_NOT_FOUND', 'The tax rule was not found.');
      return { message: 'The tax rule has been deactivated.' };
    });
  }

  // * Function [reactivateTaxRule]: Restores a deleted tax rule.
  async reactivateTaxRule(id: string, actor: string | null) {
    return this.repository.transaction(async () => {
      const current = await this.repository.getTaxRule(id, true, true);
      if (!current)
        throw new PricingNotFoundError('TAX_RULE_NOT_FOUND', 'The tax rule was not found.');
      if (!current.is_deleted) throw new ConflictError('The tax rule is already active.');
      const values = {
        taxCode: current.tax_code,
        countryCode: current.country_code,
        stateCode: current.state_code,
        validFrom: current.valid_from,
        validUntil: current.valid_until,
      };
      await this.repository.lockTaxRuleScope(values);
      if (await this.repository.overlappingTaxRuleExists(values, id))
        throw new PricingConflictError(
          'TAX_RULE_WINDOW_OVERLAP',
          'The tax-rule effective window is now in use.',
        );
      return this.repository.reactivateTaxRule(id, actor);
    });
  }
}

// * Function [pageResult]: Converts repository rows into the platform pagination envelope.
function pageResult(items: Row[], total: number, page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  return {
    data: { items },
    pagination: {
      totalCount: total,
      limit: pageSize,
      offset,
      hasNext: offset + items.length < total,
    },
  };
}
// * Function [patchValues]: Removes control fields before forwarding mutable values to persistence.
function patchValues(input: Row, excluded: string[]): Row {
  return Object.fromEntries(
    Object.entries(input).filter(([key, value]) => !excluded.includes(key) && value !== undefined),
  );
}
// * Function [versionConflict]: Raises the stable error used for optimistic-lock conflicts.
function versionConflict(current: unknown): never {
  throw new PricingConflictError('CONCURRENT_UPDATE', 'The resource changed after it was loaded.', {
    currentRowVersion: Number(current),
  });
}
// * Function [camel]: Maps database snake_case fields into public camelCase response fields.
function camel(row: Row): Row {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_m, c: string) => c.toUpperCase()),
      value,
    ]),
  );
}
// * Function [mapPriceBook]: Maps a price-book database row to an application response.
function mapPriceBook(row: Row): Row {
  return { ...camel(row), rowVersion: Number(row.row_version) };
}
// * Function [mapProductPrice]: Maps a product-price database row to an application response.
function mapProductPrice(row: Row): Row {
  return { ...camel(row), rowVersion: Number(row.row_version) };
}
// * Function [mapTaxRule]: Maps a tax-rule database row to an application response.
function mapTaxRule(row: Row): Row {
  return { ...camel(row), rowVersion: Number(row.row_version) };
}
