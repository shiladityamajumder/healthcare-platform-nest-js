/* eslint-disable @typescript-eslint/no-explicit-any */
export type PricingRow = Record<string, any>;

export interface PricingPageQuery {
  page: number;
  pageSize: number;
}
export interface PriceBookListQuery extends PricingPageQuery {
  search?: string;
  status?: string;
}
export interface ProductPriceListQuery extends PricingPageQuery {
  productId?: string;
  priceBookId?: string;
  activeAt?: Date;
}
export interface TaxRuleListQuery extends PricingPageQuery {
  taxCode?: string;
  countryCode?: string;
}
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
export interface PriceBookUpdateInput extends PricingRow {
  rowVersion: number;
}
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
export interface TaxRuleUpdateInput extends PricingRow {
  rowVersion: number;
}

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
}

export const PRICING_REPOSITORY = Symbol('PRICING_REPOSITORY');
