/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion */
import { Inject, Injectable } from '@nestjs/common';
import { ConflictError } from '@shared/errors';
import type {
  PriceBookCreateInput,
  PriceBookListQuery,
  PriceBookUpdateInput,
  PricingRepositoryPort,
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
export class PricingService {
  constructor(@Inject(PRICING_REPOSITORY) private readonly repository: PricingRepositoryPort) {}

  async listPriceBooks(query: PriceBookListQuery) {
    const result = await this.repository.listPriceBooks(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

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

  async getPriceBook(id: string, includeDeleted = false) {
    const row = await this.repository.getPriceBook(id, includeDeleted);
    if (!row)
      throw new PricingNotFoundError('PRICE_BOOK_NOT_FOUND', 'The price book was not found.');
    return mapPriceBook(row);
  }

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

  async deactivatePriceBook(id: string, actor: string | null) {
    return this.repository.transaction(async () => {
      if (!(await this.repository.deactivatePriceBook(id, actor)))
        throw new PricingNotFoundError('PRICE_BOOK_NOT_FOUND', 'The price book was not found.');
      return { message: 'The price book has been deactivated.' };
    });
  }

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

  async listProductPrices(query: ProductPriceListQuery) {
    const result = await this.repository.listProductPrices(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

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

  async listTaxRules(query: TaxRuleListQuery) {
    const result = await this.repository.listTaxRules(query);
    return pageResult(result.rows, result.total, query.page, query.pageSize);
  }

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

  async getTaxRule(id: string, includeDeleted = false) {
    const row = await this.repository.getTaxRule(id, includeDeleted);
    if (!row) throw new PricingNotFoundError('TAX_RULE_NOT_FOUND', 'The tax rule was not found.');
    return mapTaxRule(row);
  }

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

  async deactivateTaxRule(id: string, actor: string | null) {
    return this.repository.transaction(async () => {
      if (!(await this.repository.deactivateTaxRule(id, actor)))
        throw new PricingNotFoundError('TAX_RULE_NOT_FOUND', 'The tax rule was not found.');
      return { message: 'The tax rule has been deactivated.' };
    });
  }

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
function patchValues(input: Row, excluded: string[]): Row {
  return Object.fromEntries(
    Object.entries(input).filter(([key, value]) => !excluded.includes(key) && value !== undefined),
  );
}
function versionConflict(current: unknown): never {
  throw new PricingConflictError('CONCURRENT_UPDATE', 'The resource changed after it was loaded.', {
    currentRowVersion: Number(current),
  });
}
function camel(row: Row): Row {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_m, c: string) => c.toUpperCase()),
      value,
    ]),
  );
}
function mapPriceBook(row: Row): Row {
  return { ...camel(row), rowVersion: Number(row.row_version) };
}
function mapProductPrice(row: Row): Row {
  return { ...camel(row), rowVersion: Number(row.row_version) };
}
function mapTaxRule(row: Row): Row {
  return { ...camel(row), rowVersion: Number(row.row_version) };
}
