// * Pricing module: Adapts the shared PostgreSQL database to the pricing repository port.
// * File: src/infrastructure/persistence/pricing.repository.ts
// ? Keep parameterized SQL, transaction handling, row mapping, and database locking inside this adapter.
// ! Do not change table contracts or interpolate request data into SQL statements.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PostgresDatabase } from '@platform/database';
import type {
  PriceBookListQuery,
  PromotionListQuery,
  PromotionRedemptionListQuery,
  PromotionVersionListQuery,
  ProductPriceListQuery,
  CouponCodeListQuery,
  PricingEvaluationListQuery,
  TaxRuleListQuery,
} from '../../contracts/pricing.ports';

type Row = Record<string, any>;

@Injectable()
/** PostgreSQL persistence adapter for all pricing workflows. */
export class PricingRepository {
  // * Function [constructor]: Initializes the adapter with the shared PostgreSQL database client.
  constructor(private readonly database: PostgresDatabase) {}

  // * Function [transaction]: Runs a pricing workflow inside the database transaction boundary.
  transaction<T>(work: () => Promise<T>): Promise<T> {
    return this.database.transaction(() => work());
  }

  // * Function [warehouseExists]: Checks whether a warehouse reference exists before price-book creation.
  async warehouseExists(id: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM warehouse.warehouses WHERE id = $1 AND is_deleted = false LIMIT 1`,
      [id],
    );
    return Boolean(result.rowCount);
  }

  // * Function [sellerExists]: Checks whether a seller reference exists before price-book creation.
  async sellerExists(id: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM marketplace.sellers
       WHERE id = $1 AND is_deleted = false AND is_active = true LIMIT 1`,
      [id],
    );
    return Boolean(result.rowCount);
  }

  // * Function [productExists]: Checks whether a product reference exists before price creation.
  async productExists(id: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.products WHERE id = $1 AND is_deleted = false LIMIT 1`,
      [id],
    );
    return Boolean(result.rowCount);
  }

  // * Function [variantMatches]: Confirms that a variant belongs to the requested product.
  async variantMatches(id: string, productId: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.product_variants WHERE id = $1 AND product_id = $2 AND is_deleted = false LIMIT 1`,
      [id, productId],
    );
    return Boolean(result.rowCount);
  }

  // * Function [priceBookNameExists]: Checks price-book uniqueness within its commercial scope.
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

  // * Function [lockPriceBookScope]: Serializes concurrent price-book uniqueness checks.
  async lockPriceBookScope(
    name: string,
    channel: string,
    regionCode: string | null,
    sellerId: string | null,
    warehouseId: string | null,
  ): Promise<void> {
    await this.lockScope('price-book', [name, channel, regionCode, sellerId, warehouseId]);
  }

  // * Function [createPriceBook]: Inserts a price book and records its audit actor.
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

  // * Function [getPriceBook]: Retrieves one price book with optional deleted-row and row-lock behavior.
  async getPriceBook(id: string, includeDeleted = false, forUpdate = false): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM pricing.price_books WHERE id = $1 ${includeDeleted ? '' : 'AND is_deleted = false'} ${forUpdate ? 'FOR UPDATE' : ''}`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  // * Function [listPriceBooks]: Retrieves paginated price books using validated filters.
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

  // * Function [updatePriceBook]: Updates allowed price-book fields with row-version protection.
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

  // * Function [deactivatePriceBook]: Soft-deletes a price book and records deletion metadata.
  async deactivatePriceBook(id: string, actor: string | null): Promise<boolean> {
    const result = await this.database.query(
      `UPDATE pricing.price_books SET status = 'inactive', is_deleted = true, deleted_at = now(),
       deleted_by = $2, updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 AND is_deleted = false`,
      [id, actor],
    );
    return Boolean(result.rowCount);
  }

  // * Function [reactivatePriceBook]: Restores a soft-deleted price book as inactive.
  async reactivatePriceBook(id: string, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE pricing.price_books SET status = 'inactive', is_deleted = false, deleted_at = NULL,
       deleted_by = NULL, updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 RETURNING *`,
      [id, actor],
    );
    return result.rows[0] ? mapPriceBook(result.rows[0]) : null;
  }

  // * Function [overlappingPriceExists]: Detects conflicting product-price effective windows.
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

  // * Function [lockProductPriceScope]: Serializes concurrent product-price window checks.
  async lockProductPriceScope(values: Row): Promise<void> {
    await this.lockScope('product-price', [
      values.priceBookId,
      values.productId,
      values.variantId ?? null,
    ]);
  }

  // * Function [createProductPrice]: Inserts a product price with its audit actor.
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

  // * Function [listProductPrices]: Retrieves paginated product prices with price-book context.
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

  // * Function [getProductPrice]: Retrieves one product-price row with price-book context.
  async getProductPrice(id: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT pp.*, pb.name AS price_book_name, pb.currency
         FROM pricing.product_prices pp
         JOIN pricing.price_books pb ON pb.id = pp.price_book_id
        WHERE pp.id = $1`,
      [id],
    );
    return result.rows[0] ? mapProductPrice(result.rows[0]) : null;
  }

  // * Function [promotionCodeExists]: Checks case-insensitive uniqueness of active promotion codes.
  async promotionCodeExists(code: string, excludeId?: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM pricing.promotions
        WHERE lower(code) = lower($1) AND is_deleted = false
          AND ($2::uuid IS NULL OR id <> $2) LIMIT 1`,
      [code, excludeId ?? null],
    );
    return Boolean(result.rowCount);
  }

  // * Function [createPromotion]: Inserts a promotion definition and its audit fields.
  async createPromotion(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO pricing.promotions
        (code, name, promotion_type, stackability_group, priority, budget_amount, usage_limit,
         per_user_limit, starts_at, ends_at, status, exclusive, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$13) RETURNING *`,
      [
        values.code,
        values.name,
        values.promotionType,
        values.stackabilityGroup ?? null,
        values.priority ?? 0,
        values.budgetAmount ?? null,
        values.usageLimit ?? null,
        values.perUserLimit ?? null,
        values.startsAt,
        values.endsAt ?? null,
        values.status ?? 'draft',
        values.exclusive ?? false,
        actor,
      ],
    );
    return mapPromotion(result.rows[0]);
  }

  // * Function [getPromotion]: Retrieves one promotion with optional deleted-row and row-lock behavior.
  async getPromotion(id: string, includeDeleted = false, forUpdate = false): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM pricing.promotions
        WHERE id = $1 ${includeDeleted ? '' : 'AND is_deleted = false'} ${forUpdate ? 'FOR UPDATE' : ''}`,
      [id],
    );
    return result.rows[0] ? mapPromotion(result.rows[0]) : null;
  }

  // * Function [listPromotions]: Retrieves paginated promotions using search and effective-time filters.
  async listPromotions(query: PromotionListQuery) {
    const values: unknown[] = [];
    const where = ['is_deleted = false'];
    if (query.search) {
      values.push(`%${query.search}%`);
      where.push(`(code ILIKE $${values.length} OR name ILIKE $${values.length})`);
    }
    if (query.status) {
      values.push(query.status);
      where.push(`status = $${values.length}`);
    }
    if (query.activeAt) {
      values.push(query.activeAt);
      const n = values.length;
      where.push(
        `starts_at <= $${n} AND (ends_at IS NULL OR ends_at > $${n}) AND status = 'active'`,
      );
    }
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT * FROM pricing.promotions WHERE ${where.join(' AND ')}
       ORDER BY priority DESC, starts_at DESC, code, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM pricing.promotions WHERE ${where.join(' AND ')}`,
      countValues,
    );
    return { rows: rows.rows.map(mapPromotion), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [updatePromotion]: Updates allowed promotion fields with row-version protection.
  async updatePromotion(
    id: string,
    values: Row,
    actor: string | null,
    expectedRowVersion: number,
  ): Promise<Row | null> {
    return this.updateMutable(
      'pricing.promotions',
      id,
      values,
      actor,
      {
        code: 'code',
        name: 'name',
        promotionType: 'promotion_type',
        stackabilityGroup: 'stackability_group',
        priority: 'priority',
        budgetAmount: 'budget_amount',
        usageLimit: 'usage_limit',
        perUserLimit: 'per_user_limit',
        startsAt: 'starts_at',
        endsAt: 'ends_at',
        status: 'status',
        exclusive: 'exclusive',
      },
      mapPromotion,
      expectedRowVersion,
    );
  }

  // * Function [deactivatePromotion]: Soft-deletes a promotion and records deletion metadata.
  async deactivatePromotion(id: string, actor: string | null): Promise<boolean> {
    const result = await this.database.query(
      `UPDATE pricing.promotions SET status = 'inactive', is_deleted = true, deleted_at = now(),
       deleted_by = $2, updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 AND is_deleted = false`,
      [id, actor],
    );
    return Boolean(result.rowCount);
  }

  // * Function [reactivatePromotion]: Restores a soft-deleted promotion as inactive.
  async reactivatePromotion(id: string, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE pricing.promotions SET status = 'inactive', is_deleted = false, deleted_at = NULL,
       deleted_by = NULL, updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 AND is_deleted = true RETURNING *`,
      [id, actor],
    );
    return result.rows[0] ? mapPromotion(result.rows[0]) : null;
  }

  // * Function [promotionVersionExists]: Checks version-number uniqueness within a promotion.
  async promotionVersionExists(promotionId: string, versionNo: number): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM pricing.promotion_versions WHERE promotion_id = $1 AND version_no = $2 LIMIT 1`,
      [promotionId, versionNo],
    );
    return Boolean(result.rowCount);
  }

  // * Function [createPromotionVersion]: Inserts a rules-and-benefits version snapshot.
  async createPromotionVersion(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO pricing.promotion_versions
        (promotion_id, version_no, rules, benefits, published_at, created_by, updated_by)
       VALUES ($1,$2,$3::jsonb,$4::jsonb,$5,$6,$6) RETURNING *`,
      [
        values.promotionId,
        values.versionNo,
        JSON.stringify(values.rules),
        JSON.stringify(values.benefits),
        values.publishedAt ?? null,
        actor,
      ],
    );
    return mapPromotionVersion(result.rows[0]);
  }

  // * Function [getPromotionVersion]: Retrieves one promotion-version row.
  async getPromotionVersion(id: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM pricing.promotion_versions WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? mapPromotionVersion(result.rows[0]) : null;
  }

  // * Function [listPromotionVersions]: Retrieves paginated version history for a promotion.
  async listPromotionVersions(promotionId: string, query: PromotionVersionListQuery) {
    const values: unknown[] = [promotionId];
    const where = ['promotion_id = $1'];
    if (query.publishedOnly) where.push('published_at IS NOT NULL');
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT * FROM pricing.promotion_versions WHERE ${where.join(' AND ')}
       ORDER BY version_no DESC, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM pricing.promotion_versions WHERE ${where.join(' AND ')}`,
      countValues,
    );
    return { rows: rows.rows.map(mapPromotionVersion), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [publishPromotionVersion]: Publishes a version and increments its row version.
  async publishPromotionVersion(id: string, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE pricing.promotion_versions SET published_at = COALESCE(published_at, now()),
       updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 RETURNING *`,
      [id, actor],
    );
    return result.rows[0] ? mapPromotionVersion(result.rows[0]) : null;
  }

  // * Function [couponCodeExists]: Checks case-insensitive uniqueness of active coupon codes.
  async couponCodeExists(code: string, excludeId?: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM pricing.coupon_codes WHERE lower(code) = lower($1) AND is_deleted = false
       AND ($2::uuid IS NULL OR id <> $2) LIMIT 1`,
      [code, excludeId ?? null],
    );
    return Boolean(result.rowCount);
  }

  // * Function [createCouponCode]: Inserts a coupon code and its audit fields.
  async createCouponCode(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO pricing.coupon_codes
        (promotion_id, code, max_redemptions, assigned_user_id, valid_from, valid_until, is_active, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8) RETURNING *`,
      [
        values.promotionId,
        values.code,
        values.maxRedemptions ?? null,
        values.assignedUserId ?? null,
        values.validFrom ?? null,
        values.validUntil ?? null,
        values.isActive ?? true,
        actor,
      ],
    );
    return mapCouponCode(result.rows[0]);
  }

  // * Function [getCouponCode]: Retrieves one coupon with optional deleted-row and row-lock behavior.
  async getCouponCode(id: string, includeDeleted = false, forUpdate = false): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM pricing.coupon_codes WHERE id = $1 ${includeDeleted ? '' : 'AND is_deleted = false'} ${forUpdate ? 'FOR UPDATE' : ''}`,
      [id],
    );
    return result.rows[0] ? mapCouponCode(result.rows[0]) : null;
  }

  // * Function [listCouponCodes]: Retrieves paginated coupon codes using assignment and validity filters.
  async listCouponCodes(query: CouponCodeListQuery) {
    const values: unknown[] = [];
    const where = ['cc.is_deleted = false'];
    if (query.promotionId) {
      values.push(query.promotionId);
      where.push(`cc.promotion_id = $${values.length}`);
    }
    if (query.assignedUserId) {
      values.push(query.assignedUserId);
      where.push(`cc.assigned_user_id = $${values.length}`);
    }
    if (query.search) {
      values.push(`%${query.search}%`);
      where.push(`cc.code ILIKE $${values.length}`);
    }
    if (query.activeAt) {
      values.push(query.activeAt);
      const n = values.length;
      where.push(
        `cc.is_active = true AND (cc.valid_from IS NULL OR cc.valid_from <= $${n}) AND (cc.valid_until IS NULL OR cc.valid_until > $${n})`,
      );
    }
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const from = `FROM pricing.coupon_codes cc WHERE ${where.join(' AND ')}`;
    const rows = await this.database.query<Row>(
      `SELECT cc.* ${from} ORDER BY cc.created_at DESC, cc.code, cc.id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total ${from}`,
      countValues,
    );
    return { rows: rows.rows.map(mapCouponCode), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [updateCouponCode]: Updates allowed coupon fields with row-version protection.
  async updateCouponCode(
    id: string,
    values: Row,
    actor: string | null,
    expectedRowVersion: number,
  ): Promise<Row | null> {
    return this.updateMutable(
      'pricing.coupon_codes',
      id,
      values,
      actor,
      {
        code: 'code',
        maxRedemptions: 'max_redemptions',
        assignedUserId: 'assigned_user_id',
        validFrom: 'valid_from',
        validUntil: 'valid_until',
        isActive: 'is_active',
      },
      mapCouponCode,
      expectedRowVersion,
    );
  }

  // * Function [deactivateCouponCode]: Soft-deletes a coupon and disables it for redemption.
  async deactivateCouponCode(id: string, actor: string | null): Promise<boolean> {
    const result = await this.database.query(
      `UPDATE pricing.coupon_codes SET is_active = false, is_deleted = true, deleted_at = now(),
       deleted_by = $2, updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 AND is_deleted = false`,
      [id, actor],
    );
    return Boolean(result.rowCount);
  }

  // * Function [reactivateCouponCode]: Restores a soft-deleted coupon as active.
  async reactivateCouponCode(id: string, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE pricing.coupon_codes SET is_active = true, is_deleted = false, deleted_at = NULL,
       deleted_by = NULL, updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 AND is_deleted = true RETURNING *`,
      [id, actor],
    );
    return result.rows[0] ? mapCouponCode(result.rows[0]) : null;
  }

  // * Function [redemptionIdempotencyExists]: Checks whether a redemption idempotency key was used.
  async redemptionIdempotencyExists(key: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM pricing.promotion_redemptions WHERE idempotency_key = $1 LIMIT 1`,
      [key],
    );
    return Boolean(result.rowCount);
  }

  // * Function [createPromotionRedemption]: Inserts a promotion redemption record.
  async createPromotionRedemption(values: Row, _actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO pricing.promotion_redemptions
        (promotion_id, promotion_version_id, coupon_code_id, user_id, order_id, discount_amount, redeemed_at, idempotency_key)
       VALUES ($1,$2,$3,$4,$5,$6,$7, $8) RETURNING *`,
      [
        values.promotionId,
        values.promotionVersionId ?? null,
        values.couponCodeId ?? null,
        values.userId,
        values.orderId ?? null,
        values.discountAmount,
        values.redeemedAt ?? new Date(),
        values.idempotencyKey,
      ],
    );
    return mapPromotionRedemption(result.rows[0]);
  }

  // * Function [getPromotionRedemption]: Retrieves one promotion redemption row.
  async getPromotionRedemption(id: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM pricing.promotion_redemptions WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? mapPromotionRedemption(result.rows[0]) : null;
  }

  // * Function [listPromotionRedemptions]: Retrieves paginated redemption history for reconciliation.
  async listPromotionRedemptions(query: PromotionRedemptionListQuery) {
    const values: unknown[] = [];
    const where = ['1 = 1'];
    for (const [field, value] of [
      ['promotion_id', query.promotionId],
      ['user_id', query.userId],
      ['order_id', query.orderId],
    ] as const) {
      if (value) {
        values.push(value);
        where.push(`${field} = $${values.length}`);
      }
    }
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT * FROM pricing.promotion_redemptions WHERE ${where.join(' AND ')} ORDER BY redeemed_at DESC, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM pricing.promotion_redemptions WHERE ${where.join(' AND ')}`,
      countValues,
    );
    return {
      rows: rows.rows.map(mapPromotionRedemption),
      total: Number(count.rows[0]?.total ?? 0),
    };
  }

  // * Function [createPricingEvaluation]: Inserts a pricing request/response audit snapshot.
  async createPricingEvaluation(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO pricing.pricing_evaluations
        (reference_type, reference_id, user_id, request_payload, response_snapshot, rule_version)
       VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6) RETURNING *`,
      [
        values.referenceType,
        values.referenceId,
        values.userId ?? actor,
        JSON.stringify(values.requestPayload),
        JSON.stringify(values.responseSnapshot),
        values.ruleVersion,
      ],
    );
    return mapPricingEvaluation(result.rows[0]);
  }

  // * Function [getPricingEvaluation]: Retrieves one pricing evaluation row.
  async getPricingEvaluation(id: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM pricing.pricing_evaluations WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? mapPricingEvaluation(result.rows[0]) : null;
  }

  // * Function [listPricingEvaluations]: Retrieves paginated pricing evaluation snapshots.
  async listPricingEvaluations(query: PricingEvaluationListQuery) {
    const values: unknown[] = [];
    const where = ['1 = 1'];
    for (const [field, value] of [
      ['reference_type', query.referenceType],
      ['reference_id', query.referenceId],
      ['user_id', query.userId],
    ] as const) {
      if (value) {
        values.push(value);
        where.push(`${field} = $${values.length}`);
      }
    }
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT * FROM pricing.pricing_evaluations WHERE ${where.join(' AND ')} ORDER BY created_at DESC, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM pricing.pricing_evaluations WHERE ${where.join(' AND ')}`,
      countValues,
    );
    return { rows: rows.rows.map(mapPricingEvaluation), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [overlappingTaxRuleExists]: Detects conflicting tax-rule effective windows.
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

  // * Function [lockTaxRuleScope]: Serializes concurrent tax-rule scope checks.
  async lockTaxRuleScope(values: Row): Promise<void> {
    await this.lockScope('tax-rule', [
      values.taxCode,
      values.countryCode,
      values.stateCode ?? null,
    ]);
  }

  // * Function [createTaxRule]: Inserts a tax rule and its audit fields.
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

  // * Function [getTaxRule]: Retrieves one tax rule with optional deleted-row and row-lock behavior.
  async getTaxRule(id: string, includeDeleted = false, forUpdate = false): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM pricing.tax_rules WHERE id = $1 ${includeDeleted ? '' : 'AND is_deleted = false'} ${forUpdate ? 'FOR UPDATE' : ''}`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  // * Function [listTaxRules]: Retrieves paginated tax rules using code and country filters.
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

  // * Function [updateTaxRule]: Updates allowed tax-rule fields with row-version protection.
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

  // * Function [deactivateTaxRule]: Soft-deletes a tax rule and records deletion metadata.
  async deactivateTaxRule(id: string, actor: string | null): Promise<boolean> {
    const result = await this.database.query(
      `UPDATE pricing.tax_rules SET is_deleted = true, deleted_at = now(), deleted_by = $2,
       updated_by = $2, updated_at = now(), row_version = row_version + 1 WHERE id = $1 AND is_deleted = false`,
      [id, actor],
    );
    return Boolean(result.rowCount);
  }

  // * Function [reactivateTaxRule]: Restores a soft-deleted tax rule.
  async reactivateTaxRule(id: string, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE pricing.tax_rules SET is_deleted = false, deleted_at = NULL, deleted_by = NULL,
       updated_by = $2, updated_at = now(), row_version = row_version + 1 WHERE id = $1 RETURNING *`,
      [id, actor],
    );
    return result.rows[0] ? mapTaxRule(result.rows[0]) : null;
  }

  // * Function [updateMutable]: Builds a parameterized update for an allowed mutable-field map.
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

  // * Function [lockScope]: Obtains a transaction-scoped advisory lock for a pricing uniqueness scope.
  private async lockScope(prefix: string, values: readonly unknown[]): Promise<void> {
    const key = JSON.stringify([prefix, ...values]);
    await this.database.query(`SELECT pg_advisory_xact_lock(hashtextextended($1, 0))`, [key]);
  }
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
// * Function [mapPromotion]: Maps a promotion database row to an application response.
function mapPromotion(row: Row): Row {
  return { ...camel(row), rowVersion: Number(row.row_version) };
}
// * Function [mapPromotionVersion]: Maps a promotion-version database row to an application response.
function mapPromotionVersion(row: Row): Row {
  return { ...camel(row), rowVersion: Number(row.row_version) };
}
// * Function [mapCouponCode]: Maps a coupon-code database row to an application response.
function mapCouponCode(row: Row): Row {
  return { ...camel(row), rowVersion: Number(row.row_version) };
}
// * Function [mapPromotionRedemption]: Maps a redemption database row to an application response.
function mapPromotionRedemption(row: Row): Row {
  return camel(row);
}
// * Function [mapPricingEvaluation]: Maps a pricing-evaluation database row to an application response.
function mapPricingEvaluation(row: Row): Row {
  return camel(row);
}
