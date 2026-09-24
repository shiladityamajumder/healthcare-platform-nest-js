// * Pricing module: Defines application inputs, queries, and persistence ports.
// * File: src/contracts/pricing.ports.ts
// ? Keep these contracts independent from Nest transport details and database implementations.
// ! Do not expose migration or ORM concerns through the pricing repository port.
/* eslint-disable @typescript-eslint/no-explicit-any */
export type PricingRow = Record<string, any>;

/** Shared pagination contract used by all pricing list workflows. */
export interface PricingPageQuery {
  page: number;
  pageSize: number;
}
/** Price-book search and lifecycle filters. */
export interface PriceBookListQuery extends PricingPageQuery {
  search?: string;
  status?: string;
}
/** Product-price scope and effective-time filters. */
export interface ProductPriceListQuery extends PricingPageQuery {
  productId?: string;
  priceBookId?: string;
  activeAt?: Date;
}
/** Promotion search, status, and effective-time filters. */
export interface PromotionListQuery extends PricingPageQuery {
  search?: string;
  status?: string;
  activeAt?: Date;
}
/** Promotion-version publication and pagination filters. */
export interface PromotionVersionListQuery extends PricingPageQuery {
  publishedOnly: boolean;
}
/** Coupon-code ownership, search, and effective-time filters. */
export interface CouponCodeListQuery extends PricingPageQuery {
  promotionId?: string;
  assignedUserId?: string;
  search?: string;
  activeAt?: Date;
}
/** Promotion-redemption reconciliation filters. */
export interface PromotionRedemptionListQuery extends PricingPageQuery {
  promotionId?: string;
  userId?: string;
  orderId?: string;
}
/** Pricing-evaluation audit filters. */
export interface PricingEvaluationListQuery extends PricingPageQuery {
  referenceType?: string;
  referenceId?: string;
  userId?: string;
}
/** Tax-code and country filters. */
export interface TaxRuleListQuery extends PricingPageQuery {
  taxCode?: string;
  countryCode?: string;
}
/** Application input for creating a price book. */
export interface PriceBookCreateInput extends PricingRow {
  name: string;
  currency: string;
  channel: string;
  regionCode?: string;
  sellerId?: string;
  warehouseId?: string;
  validFrom: Date;
  validUntil?: Date;
  priority: number;
  status: string;
}
/** Application input for updating a price book with optimistic locking. */
export interface PriceBookUpdateInput extends PricingRow {
  rowVersion: number;
}
/** Application input for creating an effective-dated product price. */
export interface ProductPriceCreateInput extends PricingRow {
  priceBookId: string;
  productId: string;
  variantId?: string;
  mrp: string;
  sellingPrice: string;
  costPrice?: string;
  validFrom: Date;
  validUntil?: Date;
  source: string;
}
/** Application input for creating a tax rule. */
export interface TaxRuleCreateInput extends PricingRow {
  taxCode: string;
  countryCode: string;
  stateCode?: string;
  rate: string;
  validFrom: string;
  validUntil?: string;
  reverseCharge: boolean;
  metadataJson: Record<string, unknown>;
}
/** Application input for updating a tax rule with optimistic locking. */
export interface TaxRuleUpdateInput extends PricingRow {
  rowVersion: number;
}
/** Application input for creating a promotion. */
export interface PromotionCreateInput extends PricingRow {
  code: string;
  name: string;
  promotionType: string;
  stackabilityGroup?: string;
  priority: number;
  budgetAmount?: string;
  usageLimit?: number;
  perUserLimit?: number;
  startsAt: Date;
  endsAt?: Date;
  status: string;
  exclusive: boolean;
}
/** Application input for updating a promotion with optimistic locking. */
export interface PromotionUpdateInput extends PricingRow {
  rowVersion: number;
}
/** Application input for creating a versioned promotion rules snapshot. */
export interface PromotionVersionCreateInput extends PricingRow {
  promotionId: string;
  versionNo: number;
  rules: Record<string, unknown>;
  benefits: Record<string, unknown>;
  publishedAt?: Date;
}
/** Application input for creating a coupon code. */
export interface CouponCodeCreateInput extends PricingRow {
  promotionId: string;
  code: string;
  maxRedemptions?: number;
  assignedUserId?: string;
  validFrom?: Date;
  validUntil?: Date;
  isActive: boolean;
}
/** Application input for updating a coupon code with optimistic locking. */
export interface CouponCodeUpdateInput extends PricingRow {
  rowVersion: number;
}
/** Application input for recording a promotion redemption. */
export interface PromotionRedemptionCreateInput extends PricingRow {
  promotionId: string;
  promotionVersionId?: string;
  couponCodeId?: string;
  userId: string;
  orderId?: string;
  discountAmount: string;
  redeemedAt?: Date;
  idempotencyKey: string;
}
/** Application input for recording a pricing-engine evaluation snapshot. */
export interface PricingEvaluationCreateInput extends PricingRow {
  referenceType: string;
  referenceId: string;
  userId?: string;
  requestPayload: Record<string, unknown>;
  responseSnapshot: Record<string, unknown>;
  ruleVersion: string;
}

/** Persistence boundary implemented by the pricing infrastructure adapter. */
export interface PricingRepositoryPort {
  transaction<T>(work: () => Promise<T>): Promise<T>;
  warehouseExists(id: string): Promise<boolean>;
  sellerExists(id: string): Promise<boolean>;
  productExists(id: string): Promise<boolean>;
  variantMatches(id: string, productId: string): Promise<boolean>;
  priceBookNameExists(
    name: string,
    channel: string,
    regionCode: string | null,
    sellerId: string | null,
    warehouseId: string | null,
    excludeId?: string,
  ): Promise<boolean>;
  lockPriceBookScope(
    name: string,
    channel: string,
    regionCode: string | null,
    sellerId: string | null,
    warehouseId: string | null,
  ): Promise<void>;
  createPriceBook(values: PricingRow, actor: string | null): Promise<PricingRow>;
  getPriceBook(
    id: string,
    includeDeleted?: boolean,
    forUpdate?: boolean,
  ): Promise<PricingRow | null>;
  listPriceBooks(query: PriceBookListQuery): Promise<{ rows: PricingRow[]; total: number }>;
  updatePriceBook(
    id: string,
    values: PricingRow,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<PricingRow | null>;
  deactivatePriceBook(id: string, actor: string | null): Promise<boolean>;
  reactivatePriceBook(id: string, actor: string | null): Promise<PricingRow | null>;
  overlappingPriceExists(values: PricingRow): Promise<boolean>;
  lockProductPriceScope(values: PricingRow): Promise<void>;
  createProductPrice(values: PricingRow, actor: string | null): Promise<PricingRow>;
  listProductPrices(query: ProductPriceListQuery): Promise<{ rows: PricingRow[]; total: number }>;
  getProductPrice(id: string): Promise<PricingRow | null>;
  overlappingTaxRuleExists(values: PricingRow, excludeId?: string): Promise<boolean>;
  lockTaxRuleScope(values: PricingRow): Promise<void>;
  createTaxRule(values: PricingRow, actor: string | null): Promise<PricingRow>;
  getTaxRule(id: string, includeDeleted?: boolean, forUpdate?: boolean): Promise<PricingRow | null>;
  listTaxRules(query: TaxRuleListQuery): Promise<{ rows: PricingRow[]; total: number }>;
  updateTaxRule(
    id: string,
    values: PricingRow,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<PricingRow | null>;
  deactivateTaxRule(id: string, actor: string | null): Promise<boolean>;
  reactivateTaxRule(id: string, actor: string | null): Promise<PricingRow | null>;
  promotionCodeExists(code: string, excludeId?: string): Promise<boolean>;
  createPromotion(values: PricingRow, actor: string | null): Promise<PricingRow>;
  getPromotion(id: string, includeDeleted?: boolean, forUpdate?: boolean): Promise<PricingRow | null>;
  listPromotions(query: PromotionListQuery): Promise<{ rows: PricingRow[]; total: number }>;
  updatePromotion(id: string, values: PricingRow, actor: string | null, expectedRowVersion: number): Promise<PricingRow | null>;
  deactivatePromotion(id: string, actor: string | null): Promise<boolean>;
  reactivatePromotion(id: string, actor: string | null): Promise<PricingRow | null>;
  promotionVersionExists(promotionId: string, versionNo: number): Promise<boolean>;
  createPromotionVersion(values: PromotionVersionCreateInput, actor: string | null): Promise<PricingRow>;
  getPromotionVersion(id: string): Promise<PricingRow | null>;
  listPromotionVersions(promotionId: string, query: PromotionVersionListQuery): Promise<{ rows: PricingRow[]; total: number }>;
  publishPromotionVersion(id: string, actor: string | null): Promise<PricingRow | null>;
  couponCodeExists(code: string, excludeId?: string): Promise<boolean>;
  createCouponCode(values: CouponCodeCreateInput, actor: string | null): Promise<PricingRow>;
  getCouponCode(id: string, includeDeleted?: boolean, forUpdate?: boolean): Promise<PricingRow | null>;
  listCouponCodes(query: CouponCodeListQuery): Promise<{ rows: PricingRow[]; total: number }>;
  updateCouponCode(id: string, values: PricingRow, actor: string | null, expectedRowVersion: number): Promise<PricingRow | null>;
  deactivateCouponCode(id: string, actor: string | null): Promise<boolean>;
  reactivateCouponCode(id: string, actor: string | null): Promise<PricingRow | null>;
  redemptionIdempotencyExists(key: string): Promise<boolean>;
  createPromotionRedemption(values: PromotionRedemptionCreateInput, actor: string | null): Promise<PricingRow>;
  getPromotionRedemption(id: string): Promise<PricingRow | null>;
  listPromotionRedemptions(query: PromotionRedemptionListQuery): Promise<{ rows: PricingRow[]; total: number }>;
  createPricingEvaluation(values: PricingEvaluationCreateInput, actor: string | null): Promise<PricingRow>;
  getPricingEvaluation(id: string): Promise<PricingRow | null>;
  listPricingEvaluations(query: PricingEvaluationListQuery): Promise<{ rows: PricingRow[]; total: number }>;
}

export const PRICING_REPOSITORY = Symbol('PRICING_REPOSITORY');
