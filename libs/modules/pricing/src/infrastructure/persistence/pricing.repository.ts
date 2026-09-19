/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PostgresDatabase } from '@platform/database';
import type {
  PriceBookListQuery,
  ProductPriceListQuery,
  TaxRuleListQuery,
} from '../../contracts/pricing.ports';

type Row = Record<string, any>;

@Injectable()
export class PricingRepository {
  constructor(private readonly database: PostgresDatabase) {}

  transaction<T>(work: () => Promise<T>): Promise<T> {
    return this.database.transaction(() => work());
  }

  async warehouseExists(id: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM warehouse.warehouses WHERE id = $1 AND is_deleted = false LIMIT 1`,
      [id],
    );
    return Boolean(result.rowCount);
  }

  async sellerExists(id: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM marketplace.sellers
       WHERE id = $1 AND is_deleted = false AND is_active = true LIMIT 1`,
      [id],
    );
    return Boolean(result.rowCount);
  }

  async productExists(id: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.products WHERE id = $1 AND is_deleted = false LIMIT 1`,
      [id],
    );
    return Boolean(result.rowCount);
  }

  async variantMatches(id: string, productId: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.product_variants WHERE id = $1 AND product_id = $2 AND is_deleted = false LIMIT 1`,
      [id, productId],
    );
    return Boolean(result.rowCount);
  }

  async priceBookNameExists(
    name: string,
    channel: string,
    regionCode: string | null,
    sellerId: string | null,
    warehouseId: string | null,
    excludeId?: string,
  ): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM pricing.price_books WHERE lower(name) = lower($1) AND lower(channel) = lower($2)
        AND region_code IS NOT DISTINCT FROM $3::text
        AND seller_id IS NOT DISTINCT FROM $4::uuid
        AND warehouse_id IS NOT DISTINCT FROM $5::uuid AND is_deleted = false
        AND ($6::uuid IS NULL OR id <> $6) LIMIT 1`,
      [name, channel, regionCode, sellerId, warehouseId, excludeId ?? null],
    );
    return Boolean(result.rowCount);
  }

  async lockPriceBookScope(
    name: string,
    channel: string,
    regionCode: string | null,
    sellerId: string | null,
    warehouseId: string | null,
  ): Promise<void> {
    await this.lockScope('price-book', [name, channel, regionCode, sellerId, warehouseId]);
  }

  async createPriceBook(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO pricing.price_books
        (name, currency, channel, region_code, seller_id, warehouse_id, valid_from, valid_until,
         priority, status, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11) RETURNING *`,
      [
        values.name,
        values.currency,
        values.channel,
        values.regionCode ?? null,
        values.sellerId ?? null,
        values.warehouseId ?? null,
        values.validFrom,
        values.validUntil ?? null,
        values.priority,
        values.status,
        actor,
      ],
    );
    return result.rows[0];
  }

  async getPriceBook(id: string, includeDeleted = false, forUpdate = false): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM pricing.price_books WHERE id = $1 ${includeDeleted ? '' : 'AND is_deleted = false'} ${forUpdate ? 'FOR UPDATE' : ''}`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  async listPriceBooks(query: PriceBookListQuery) {
    const values: unknown[] = [];
    const where = ['is_deleted = false'];
    if (query.search) {
      values.push(`%${query.search}%`);
      where.push(`name ILIKE $${values.length}`);
    }
    if (query.status) {
      values.push(query.status);
      where.push(`status = $${values.length}`);
    }
    const countValues = [...values];
    const offset = (query.page - 1) * query.pageSize;
    values.push(query.pageSize, offset);
    const rows = await this.database.query<Row>(
      `SELECT * FROM pricing.price_books WHERE ${where.join(' AND ')} ORDER BY priority DESC, name, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM pricing.price_books WHERE ${where.join(' AND ')}`,
      countValues,
    );
    return { rows: rows.rows.map(mapPriceBook), total: Number(count.rows[0]?.total ?? 0) };
  }

  async updatePriceBook(
    id: string,
    values: Row,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<Row | null> {
    return this.updateMutable(
      'pricing.price_books',
      id,
      values,
      actor,
      {
        name: 'name',
        validFrom: 'valid_from',
        validUntil: 'valid_until',
        priority: 'priority',
        status: 'status',
      },
      mapPriceBook,
      expectedRowVersion,
    );
  }

  async deactivatePriceBook(id: string, actor: string | null): Promise<boolean> {
    const result = await this.database.query(
      `UPDATE pricing.price_books SET status = 'inactive', is_deleted = true, deleted_at = now(),
       deleted_by = $2, updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 AND is_deleted = false`,
      [id, actor],
    );
    return Boolean(result.rowCount);
  }

  async reactivatePriceBook(id: string, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE pricing.price_books SET status = 'inactive', is_deleted = false, deleted_at = NULL,
       deleted_by = NULL, updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 RETURNING *`,
      [id, actor],
    );
    return result.rows[0] ? mapPriceBook(result.rows[0]) : null;
  }

  async overlappingPriceExists(values: Row): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM pricing.product_prices WHERE price_book_id = $1 AND product_id = $2
       AND variant_id IS NOT DISTINCT FROM $3::uuid
       AND (valid_until IS NULL OR valid_until > $4)
       AND ($5::timestamptz IS NULL OR valid_from < $5) LIMIT 1`,
      [
        values.priceBookId,
        values.productId,
        values.variantId ?? null,
        values.validFrom,
        values.validUntil ?? null,
      ],
    );
    return Boolean(result.rowCount);
  }

  async lockProductPriceScope(values: Row): Promise<void> {
    await this.lockScope('product-price', [
      values.priceBookId,
      values.productId,
      values.variantId ?? null,
    ]);
  }

  async createProductPrice(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO pricing.product_prices
        (price_book_id, product_id, variant_id, mrp, selling_price, cost_price, valid_from, valid_until,
         source, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10) RETURNING *`,
      [
        values.priceBookId,
        values.productId,
        values.variantId ?? null,
        values.mrp,
        values.sellingPrice,
        values.costPrice ?? null,
        values.validFrom,
        values.validUntil ?? null,
        values.source,
        actor,
      ],
    );
    return result.rows[0];
  }

  async listProductPrices(query: ProductPriceListQuery) {
    const values: unknown[] = [];
    const where = ['pb.is_deleted = false'];
    if (query.productId) {
      values.push(query.productId);
      where.push(`pp.product_id = $${values.length}`);
    }
    if (query.priceBookId) {
      values.push(query.priceBookId);
      where.push(`pp.price_book_id = $${values.length}`);
    }
    if (query.activeAt) {
      values.push(query.activeAt);
      const n = values.length;
      where.push(
        `pp.valid_from <= $${n} AND (pp.valid_until IS NULL OR pp.valid_until > $${n}) AND pb.valid_from <= $${n} AND (pb.valid_until IS NULL OR pb.valid_until > $${n}) AND pb.status = 'active'`,
      );
    }
    const countValues = [...values];
    const offset = (query.page - 1) * query.pageSize;
    values.push(query.pageSize, offset);
    const from = `FROM pricing.product_prices pp JOIN pricing.price_books pb ON pb.id = pp.price_book_id WHERE ${where.join(' AND ')}`;
    const rows = await this.database.query<Row>(
      `SELECT pp.*, pb.name AS price_book_name, pb.currency ${from} ORDER BY pp.valid_from DESC, pp.id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total ${from}`,
      countValues,
    );
    return { rows: rows.rows.map(mapProductPrice), total: Number(count.rows[0]?.total ?? 0) };
  }

  async overlappingTaxRuleExists(values: Row, excludeId?: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM pricing.tax_rules WHERE tax_code = $1 AND country_code = $2
       AND state_code IS NOT DISTINCT FROM $3::text AND is_deleted = false
       AND (valid_until IS NULL OR valid_until >= $4::date)
       AND ($5::date IS NULL OR valid_from <= $5::date)
       AND ($6::uuid IS NULL OR id <> $6) LIMIT 1`,
      [
        values.taxCode,
        values.countryCode,
        values.stateCode ?? null,
        values.validFrom,
        values.validUntil ?? null,
        excludeId ?? null,
      ],
    );
    return Boolean(result.rowCount);
  }

  async lockTaxRuleScope(values: Row): Promise<void> {
    await this.lockScope('tax-rule', [
      values.taxCode,
      values.countryCode,
      values.stateCode ?? null,
    ]);
  }

  async createTaxRule(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO pricing.tax_rules
        (tax_code, country_code, state_code, rate, valid_from, valid_until, reverse_charge,
         metadata_json, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$9) RETURNING *`,
      [
        values.taxCode,
        values.countryCode,
        values.stateCode ?? null,
        values.rate,
        values.validFrom,
        values.validUntil ?? null,
        values.reverseCharge,
        JSON.stringify(values.metadataJson),
        actor,
      ],
    );
    return mapTaxRule(result.rows[0]);
  }

  async getTaxRule(id: string, includeDeleted = false, forUpdate = false): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM pricing.tax_rules WHERE id = $1 ${includeDeleted ? '' : 'AND is_deleted = false'} ${forUpdate ? 'FOR UPDATE' : ''}`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  async listTaxRules(query: TaxRuleListQuery) {
    const values: unknown[] = [];
    const where = ['is_deleted = false'];
    if (query.taxCode) {
      values.push(query.taxCode.toUpperCase());
      where.push(`tax_code = $${values.length}`);
    }
    if (query.countryCode) {
      values.push(query.countryCode.toUpperCase());
      where.push(`country_code = $${values.length}`);
    }
    const countValues = [...values];
    const offset = (query.page - 1) * query.pageSize;
    values.push(query.pageSize, offset);
    const rows = await this.database.query<Row>(
      `SELECT * FROM pricing.tax_rules WHERE ${where.join(' AND ')} ORDER BY tax_code, valid_from DESC, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM pricing.tax_rules WHERE ${where.join(' AND ')}`,
      countValues,
    );
    return { rows: rows.rows.map(mapTaxRule), total: Number(count.rows[0]?.total ?? 0) };
  }

  async updateTaxRule(
    id: string,
    values: Row,
    actor: string | null,
    expectedRowVersion?: number,
  ): Promise<Row | null> {
    return this.updateMutable(
      'pricing.tax_rules',
      id,
      values,
      actor,
      {
        rate: 'rate',
        validFrom: 'valid_from',
        validUntil: 'valid_until',
        reverseCharge: 'reverse_charge',
        metadataJson: 'metadata_json',
      },
      mapTaxRule,
      expectedRowVersion,
    );
  }

  async deactivateTaxRule(id: string, actor: string | null): Promise<boolean> {
    const result = await this.database.query(
      `UPDATE pricing.tax_rules SET is_deleted = true, deleted_at = now(), deleted_by = $2,
       updated_by = $2, updated_at = now(), row_version = row_version + 1 WHERE id = $1 AND is_deleted = false`,
      [id, actor],
    );
    return Boolean(result.rowCount);
  }

  async reactivateTaxRule(id: string, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE pricing.tax_rules SET is_deleted = false, deleted_at = NULL, deleted_by = NULL,
       updated_by = $2, updated_at = now(), row_version = row_version + 1 WHERE id = $1 RETURNING *`,
      [id, actor],
    );
    return result.rows[0] ? mapTaxRule(result.rows[0]) : null;
  }

  private async updateMutable(
    table: string,
    id: string,
    values: Row,
    actor: string | null,
    allowed: Record<string, string>,
    mapper: (row: Row) => Row,
    expectedRowVersion?: number,
  ): Promise<Row | null> {
    const entries = Object.entries(values).filter(([key]) => allowed[key]);
    const params = entries.map(([, value]) =>
      value && typeof value === 'object' && !(value instanceof Date)
        ? JSON.stringify(value)
        : value,
    );
    const sets = entries.map(
      ([key], index) => `${allowed[key]} = $${index + 1}${key === 'metadataJson' ? '::jsonb' : ''}`,
    );
    const actorIndex = params.length + 1;
    params.push(actor);
    const versionIndex = expectedRowVersion === undefined ? undefined : params.length + 1;
    if (expectedRowVersion !== undefined) params.push(expectedRowVersion);
    const idIndex = params.length + 1;
    params.push(id);
    const versionClause = versionIndex === undefined ? '' : ` AND row_version = $${versionIndex}`;
    const result = await this.database.query<Row>(
      `UPDATE ${table} SET ${sets.join(', ')}, updated_by = $${actorIndex}, updated_at = now(),
       row_version = row_version + 1 WHERE id = $${idIndex} AND is_deleted = false${versionClause} RETURNING *`,
      params,
    );
    return result.rows[0] ? mapper(result.rows[0]) : null;
  }

  private async lockScope(prefix: string, values: readonly unknown[]): Promise<void> {
    const key = JSON.stringify([prefix, ...values]);
    await this.database.query(`SELECT pg_advisory_xact_lock(hashtextextended($1, 0))`, [key]);
  }
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
