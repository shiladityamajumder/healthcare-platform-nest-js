// * Inventory module: Adapts the existing warehouse PostgreSQL tables to the inventory port.
// * File: src/infrastructure/persistence/inventory.repository.ts
// ? Keep all SQL parameterized and all database-specific details inside this adapter.
// ! Do not add migrations, alter tables, or interpolate request values into SQL identifiers.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PostgresDatabase } from '@platform/database';
import type {
  InventoryListQuery,
  InventoryPageQuery,
  InventoryRepositoryPort,
  WarehouseListQuery,
} from '../../contracts/inventory.ports';

type Row = Record<string, any>;

@Injectable()
export class InventoryRepository implements InventoryRepositoryPort {
  // * Function [constructor]: Receives the shared PostgreSQL adapter for transaction-aware queries.
  public constructor(private readonly database: PostgresDatabase) {}

  // * Function [transaction]: Executes an inventory workflow inside the shared transaction context.
  transaction<T>(work: () => Promise<T>): Promise<T> {
    return this.database.transaction(() => work());
  }

  // * Function [warehouseExists]: Checks whether an active warehouse exists.
  async warehouseExists(id: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM warehouse.warehouses WHERE id = $1 AND is_deleted = false`,
      [id],
    );
    return Boolean(result.rowCount);
  }

  // * Function [locationExists]: Checks whether an organization location exists.
  async locationExists(id: string): Promise<boolean> {
    const result = await this.database.query(`SELECT 1 FROM organization.locations WHERE id = $1`, [
      id,
    ]);
    return Boolean(result.rowCount);
  }

  // * Function [productExists]: Checks whether an active catalog product exists.
  async productExists(id: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.products WHERE id = $1 AND is_deleted = false`,
      [id],
    );
    return Boolean(result.rowCount);
  }

  // * Function [variantMatches]: Confirms that a variant belongs to the selected product.
  async variantMatches(id: string, productId: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM catalog.product_variants WHERE id = $1 AND product_id = $2 AND is_deleted = false`,
      [id, productId],
    );
    return Boolean(result.rowCount);
  }

  // * Function [binExistsForWarehouse]: Confirms that a bin belongs to an active warehouse.
  async binExistsForWarehouse(id: string, warehouseId: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1 FROM warehouse.bins WHERE id = $1 AND warehouse_id = $2 AND is_deleted = false`,
      [id, warehouseId],
    );
    return Boolean(result.rowCount);
  }

  // * Function [listWarehouses]: Queries filtered, sorted, and paginated warehouse records.
  async listWarehouses(query: WarehouseListQuery) {
    const values: unknown[] = [];
    const where: string[] = [];
    if (!query.includeDeleted) where.push('w.is_deleted = false');
    if (query.search) {
      values.push(`%${query.search}%`);
      where.push(`(w.name ILIKE $${values.length} OR w.code ILIKE $${values.length})`);
    }
    if (query.status) {
      values.push(query.status);
      where.push(`w.status = $${values.length}`);
    }
    if (query.warehouseType) {
      values.push(query.warehouseType);
      where.push(`w.warehouse_type = $${values.length}`);
    }
    if (query.supportsColdChain !== undefined) {
      values.push(query.supportsColdChain);
      where.push(`w.supports_cold_chain = $${values.length}`);
    }
    if (query.supportsControlledDrugs !== undefined) {
      values.push(query.supportsControlledDrugs);
      where.push(`w.supports_controlled_drugs = $${values.length}`);
    }
    const sortMap: Record<string, string> = {
      name: 'w.name',
      code: 'w.code',
      createdAt: 'w.created_at',
    };
    const sort = sortMap[query.sortBy] ?? sortMap.name;
    const direction = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    const filter = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT w.*, l.name AS location_name
         FROM warehouse.warehouses w
         LEFT JOIN organization.locations l ON l.id = w.location_id
        ${filter} ORDER BY ${sort} ${direction}, w.id
        LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM warehouse.warehouses w ${filter}`,
      countValues,
    );
    return { rows: rows.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [createWarehouse]: Inserts one warehouse using the existing table contract.
  async createWarehouse(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.warehouses
        (organization_id, location_id, code, name, warehouse_type, status,
         supports_cold_chain, supports_controlled_drugs, operating_hours, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$10) RETURNING *`,
      [
        values.organizationId,
        values.locationId,
        values.code,
        values.name,
        values.warehouseType,
        values.status ?? 'active',
        values.supportsColdChain ?? false,
        values.supportsControlledDrugs ?? false,
        JSON.stringify(values.operatingHours ?? {}),
        actor,
      ],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [getWarehouse]: Retrieves one warehouse with optional soft-delete visibility and locking.
  async getWarehouse(id: string, includeDeleted = false, forUpdate = false): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.warehouses
        WHERE id = $1 ${includeDeleted ? '' : 'AND is_deleted = false'} ${forUpdate ? 'FOR UPDATE' : ''}`,
      [id],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [updateWarehouse]: Updates mutable warehouse fields and increments rowVersion.
  async updateWarehouse(id: string, values: Row, actor: string | null): Promise<Row | null> {
    const current = await this.getWarehouse(id, false, true);
    if (!current) return null;
    const entries = Object.entries(values).filter(([key]) => warehouseFields[key]);
    if (!entries.length) return mapRow(current);
    const params = entries.map(([, value]) => jsonValue(value));
    const assignments = entries.map(
      ([key], index) =>
        `${warehouseFields[key]} = $${index + 1}${key === 'operatingHours' ? '::jsonb' : ''}`,
    );
    const actorIndex = params.length + 1;
    params.push(actor);
    params.push(id);
    const result = await this.database.query<Row>(
      `UPDATE warehouse.warehouses SET ${assignments.join(', ')}, updated_by = $${actorIndex},
       updated_at = now(), row_version = row_version + 1
       WHERE id = $${params.length} AND is_deleted = false RETURNING *`,
      params,
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [deactivateWarehouse]: Soft-deletes a warehouse for historical preservation.
  async deactivateWarehouse(id: string, actor: string | null): Promise<boolean> {
    const result = await this.database.query(
      `UPDATE warehouse.warehouses SET is_deleted = true, deleted_at = now(), deleted_by = $2,
       updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 AND is_deleted = false`,
      [id, actor],
    );
    return Boolean(result.rowCount);
  }

  // * Function [reactivateWarehouse]: Restores a soft-deleted warehouse record.
  async reactivateWarehouse(id: string, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE warehouse.warehouses SET is_deleted = false, deleted_at = NULL, deleted_by = NULL,
       updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 AND is_deleted = true RETURNING *`,
      [id, actor],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [listWarehouseBins]: Returns active bins with zone, aisle, and rack labels.
  async listWarehouseBins(warehouseId: string): Promise<Row[]> {
    const result = await this.database.query<Row>(
      `SELECT b.*, z.code AS zone_code, r.code AS rack_code, a.code AS aisle_code
         FROM warehouse.bins b
         JOIN warehouse.zones z ON z.id = b.zone_id AND z.is_deleted = false
         LEFT JOIN warehouse.racks r ON r.id = b.rack_id AND r.is_deleted = false
         LEFT JOIN warehouse.aisles a ON a.id = r.aisle_id AND a.is_deleted = false
        WHERE b.warehouse_id = $1 AND b.is_deleted = false
        ORDER BY b.pick_sequence NULLS LAST, b.code, b.id`,
      [warehouseId],
    );
    return result.rows.map(mapRow);
  }

  // * Function [listLocationHierarchy]: Returns the warehouse location hierarchy for placement screens.
  async listLocationHierarchy(warehouseId?: string): Promise<Row[]> {
    const values: unknown[] = [];
    const filter = warehouseId ? `WHERE b.warehouse_id = $1` : '';
    if (warehouseId) values.push(warehouseId);
    const result = await this.database.query<Row>(
      `SELECT b.*, z.code AS zone_code, z.name AS zone_name, z.zone_type,
              a.code AS aisle_code, a.name AS aisle_name,
              r.code AS rack_code, r.rack_type,
              w.code AS warehouse_code, w.name AS warehouse_name
         FROM warehouse.bins b
         JOIN warehouse.zones z ON z.id = b.zone_id AND z.is_deleted = false
         LEFT JOIN warehouse.racks r ON r.id = b.rack_id AND r.is_deleted = false
         LEFT JOIN warehouse.aisles a ON a.id = r.aisle_id AND a.is_deleted = false
         JOIN warehouse.warehouses w ON w.id = b.warehouse_id AND w.is_deleted = false
        ${filter} ORDER BY w.name, z.code, a.code NULLS FIRST, r.code NULLS FIRST, b.pick_sequence NULLS LAST, b.code, b.id`,
      values,
    );
    return result.rows.map(mapRow);
  }

  // * Function [upsertReplenishmentRule]: Inserts or updates one product replenishment rule.
  async upsertReplenishmentRule(values: Row, actor: string | null): Promise<Row> {
    const existing = await this.database.query<Row>(
      `SELECT * FROM warehouse.replenishment_rules
        WHERE warehouse_id = $1 AND product_id = $2
          AND variant_id IS NOT DISTINCT FROM $3::uuid AND is_deleted = false
        LIMIT 1 FOR UPDATE`,
      [values.warehouseId, values.productId, values.variantId ?? null],
    );
    if (existing.rows[0]) {
      const result = await this.database.query<Row>(
        `UPDATE warehouse.replenishment_rules SET minimum_qty = $2, maximum_qty = $3,
         reorder_qty = $4, preferred_supplier_id = $5, is_active = $6,
         updated_by = $7, updated_at = now(), row_version = row_version + 1
         WHERE id = $1 RETURNING *`,
        [
          existing.rows[0].id,
          values.minimumQuantity,
          values.maximumQuantity,
          values.reorderQuantity,
          values.preferredSupplierId ?? null,
          values.isActive ?? true,
          actor,
        ],
      );
      return mapRow(result.rows[0]);
    }
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.replenishment_rules
        (warehouse_id, product_id, variant_id, minimum_qty, maximum_qty, reorder_qty,
         preferred_supplier_id, is_active, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9) RETURNING *`,
      [
        values.warehouseId,
        values.productId,
        values.variantId ?? null,
        values.minimumQuantity,
        values.maximumQuantity,
        values.reorderQuantity,
        values.preferredSupplierId ?? null,
        values.isActive ?? true,
        actor,
      ],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [listReplenishmentRules]: Returns paginated rules for one warehouse.
  async listReplenishmentRules(warehouseId: string, query: InventoryPageQuery) {
    const values: unknown[] = [warehouseId, query.pageSize, (query.page - 1) * query.pageSize];
    const rows = await this.database.query<Row>(
      `SELECT rr.*, p.sku, p.name AS product_name
         FROM warehouse.replenishment_rules rr
         JOIN catalog.products p ON p.id = rr.product_id
        WHERE rr.warehouse_id = $1 AND rr.is_deleted = false
        ORDER BY p.name, rr.id LIMIT $2 OFFSET $3`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM warehouse.replenishment_rules WHERE warehouse_id = $1 AND is_deleted = false`,
      [warehouseId],
    );
    return { rows: rows.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [listInventory]: Returns balance-level stock rows for catalogue and fulfilment reads.
  async listInventory(query: InventoryListQuery) {
    return this.listInventoryRows(query, false);
  }

  // * Function [listWarehouseInventory]: Restricts balance-level inventory to one warehouse.
  async listWarehouseInventory(warehouseId: string, query: InventoryListQuery) {
    return this.listInventoryRows({ ...query, warehouseId }, false);
  }

  // * Function [listLots]: Returns lot-level aggregates including zero-balance lots.
  async listLots(query: InventoryListQuery) {
    const values: unknown[] = [];
    const where: string[] = ['w.is_deleted = false'];
    if (query.productId) {
      values.push(query.productId);
      where.push(`il.product_id = $${values.length}`);
    }
    if (query.variantId) {
      values.push(query.variantId);
      where.push(`il.variant_id = $${values.length}`);
    }
    if (query.warehouseId) {
      values.push(query.warehouseId);
      where.push(`il.warehouse_id = $${values.length}`);
    }
    if (query.qualityStatus) {
      values.push(query.qualityStatus);
      where.push(`il.quality_status = $${values.length}`);
    }
    if (query.search) {
      values.push(`%${query.search}%`);
      where.push(
        `(p.name ILIKE $${values.length} OR p.sku ILIKE $${values.length} OR il.batch_number ILIKE $${values.length})`,
      );
    }
    if (query.expired === true) where.push('il.expires_at < CURRENT_DATE');
    if (query.expiringSoon === true) {
      values.push(query.expiryDays);
      where.push(
        `il.expires_at >= CURRENT_DATE AND il.expires_at <= CURRENT_DATE + $${values.length}::int`,
      );
    }
    const available =
      '(COALESCE(SUM(sb.on_hand_qty), 0) - COALESCE(SUM(sb.reserved_qty), 0) - COALESCE(SUM(sb.damaged_qty), 0) - COALESCE(SUM(sb.quarantined_qty), 0))';
    const having: string[] = [];
    if (query.inStock === true) having.push(`${available} > 0`);
    if (query.inStock === false) having.push(`${available} <= 0`);
    if (query.lowStock === true) {
      having.push(`${available} <= COALESCE((SELECT rr.minimum_qty FROM warehouse.replenishment_rules rr
        WHERE rr.warehouse_id = il.warehouse_id AND rr.product_id = il.product_id
          AND rr.variant_id IS NOT DISTINCT FROM il.variant_id AND rr.is_active = true AND rr.is_deleted = false
        LIMIT 1), -1)`);
    }
    const filter = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const havingFilter = having.length ? `HAVING ${having.join(' AND ')}` : '';
    const groupBy = 'GROUP BY il.id, p.sku, p.name, w.name';
    const sortMap: Record<string, string> = {
      productName: 'product_name',
      expiresAt: 'expires_at',
      availableQty: 'available_qty',
    };
    const sort = sortMap[query.sortBy] ?? sortMap.productName;
    const direction = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT il.*, COALESCE(SUM(sb.on_hand_qty), 0) AS on_hand_qty,
              COALESCE(SUM(sb.reserved_qty), 0) AS reserved_qty,
              COALESCE(SUM(sb.damaged_qty), 0) AS damaged_qty,
              COALESCE(SUM(sb.quarantined_qty), 0) AS quarantined_qty,
              ${available} AS available_qty, p.sku, p.name AS product_name, w.name AS warehouse_name
         FROM warehouse.inventory_lots il
         JOIN catalog.products p ON p.id = il.product_id AND p.is_deleted = false
         JOIN warehouse.warehouses w ON w.id = il.warehouse_id
         LEFT JOIN warehouse.stock_balances sb ON sb.lot_id = il.id
        ${filter} ${groupBy} ${havingFilter}
        ORDER BY ${sort} ${direction}, il.id
        LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM (
         SELECT il.id
           FROM warehouse.inventory_lots il
           JOIN catalog.products p ON p.id = il.product_id AND p.is_deleted = false
           JOIN warehouse.warehouses w ON w.id = il.warehouse_id
           LEFT JOIN warehouse.stock_balances sb ON sb.lot_id = il.id
          ${filter} ${groupBy} ${havingFilter}
       ) lots`,
      countValues,
    );
    return { rows: rows.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [listInventoryRows]: Builds the shared parameterized inventory balance query.
  private async listInventoryRows(query: InventoryListQuery, lotsOnly: boolean) {
    const values: unknown[] = [];
    const where: string[] = ['w.is_deleted = false'];
    if (query.productId) {
      values.push(query.productId);
      where.push(`il.product_id = $${values.length}`);
    }
    if (query.variantId) {
      values.push(query.variantId);
      where.push(`il.variant_id = $${values.length}`);
    }
    if (query.warehouseId) {
      values.push(query.warehouseId);
      where.push(`sb.warehouse_id = $${values.length}`);
    }
    if (query.qualityStatus) {
      values.push(query.qualityStatus);
      where.push(`il.quality_status = $${values.length}`);
    }
    if (query.search) {
      values.push(`%${query.search}%`);
      where.push(
        `(p.name ILIKE $${values.length} OR p.sku ILIKE $${values.length} OR il.batch_number ILIKE $${values.length})`,
      );
    }
    const available = '(sb.on_hand_qty - sb.reserved_qty - sb.damaged_qty - sb.quarantined_qty)';
    if (query.inStock === true) where.push(`${available} > 0`);
    if (query.inStock === false) where.push(`${available} <= 0`);
    if (query.expired === true) where.push('il.expires_at < CURRENT_DATE');
    if (query.expiringSoon === true) {
      values.push(query.expiryDays);
      where.push(
        `il.expires_at >= CURRENT_DATE AND il.expires_at <= CURRENT_DATE + $${values.length}::int`,
      );
    }
    if (query.lowStock === true) {
      where.push(`EXISTS (SELECT 1 FROM warehouse.replenishment_rules rr WHERE rr.warehouse_id = sb.warehouse_id
        AND rr.product_id = il.product_id AND rr.variant_id IS NOT DISTINCT FROM il.variant_id
        AND rr.is_active = true AND rr.is_deleted = false AND ${available} <= rr.minimum_qty)`);
    }
    const filter = `WHERE ${where.join(' AND ')}`;
    const select = lotsOnly
      ? `il.*, sb.bin_id, sb.on_hand_qty, sb.reserved_qty, sb.damaged_qty, sb.quarantined_qty,
          ${available} AS available_qty, p.sku, p.name AS product_name, w.name AS warehouse_name, b.code AS bin_code`
      : `sb.*, il.product_id, il.variant_id, il.batch_number, il.expires_at, il.quality_status, il.recall_status,
          ${available} AS available_qty, p.sku, p.name AS product_name, w.name AS warehouse_name, b.code AS bin_code`;
    const sortMap: Record<string, string> = {
      productName: 'p.name',
      expiresAt: 'il.expires_at',
      availableQty: available,
      updatedAt: 'sb.updated_at',
    };
    const sort = sortMap[query.sortBy] ?? sortMap.productName;
    const direction = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT ${select}
         FROM warehouse.stock_balances sb
         JOIN warehouse.inventory_lots il ON il.id = sb.lot_id
         JOIN catalog.products p ON p.id = il.product_id AND p.is_deleted = false
         JOIN warehouse.warehouses w ON w.id = sb.warehouse_id
         LEFT JOIN warehouse.bins b ON b.id = sb.bin_id
        ${filter} ORDER BY ${sort} ${direction}, sb.id
        LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
         FROM warehouse.stock_balances sb
         JOIN warehouse.inventory_lots il ON il.id = sb.lot_id
         JOIN catalog.products p ON p.id = il.product_id AND p.is_deleted = false
         JOIN warehouse.warehouses w ON w.id = sb.warehouse_id
        ${filter}`,
      countValues,
    );
    return { rows: rows.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [createLot]: Persists lot metadata without creating schema-owned fields.
  async createLot(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.inventory_lots
        (warehouse_id, product_id, variant_id, supplier_id, goods_receipt_item_id, batch_number,
         manufactured_at, expires_at, purchase_cost, mrp, quality_status, recall_status, received_at,
         created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$14) RETURNING *`,
      [
        values.warehouseId,
        values.productId,
        values.variantId ?? null,
        values.supplierId ?? null,
        values.goodsReceiptItemId ?? null,
        values.batchNumber,
        values.manufacturedAt ?? null,
        values.expiresAt,
        values.purchaseCost ?? null,
        values.mrp,
        values.qualityStatus ?? 'pending',
        values.recallStatus ?? 'clear',
        values.receivedAt ?? new Date(),
        actor,
      ],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [getLot]: Retrieves one inventory lot by UUID.
  async getLot(id: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.inventory_lots WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [updateLot]: Applies a row-version guarded lot update.
  async updateLot(
    id: string,
    values: Row,
    actor: string | null,
    rowVersion: number,
  ): Promise<Row | null> {
    const entries = Object.entries(values).filter(([key]) => lotFields[key]);
    if (!entries.length) return this.getLot(id);
    const params = entries.map(([, value]) => value);
    const assignments = entries.map(([key], index) => `${lotFields[key]} = $${index + 1}`);
    const actorIndex = params.length + 1;
    params.push(actor, rowVersion, id);
    const result = await this.database.query<Row>(
      `UPDATE warehouse.inventory_lots SET ${assignments.join(', ')}, updated_by = $${actorIndex},
       updated_at = now(), row_version = row_version + 1
       WHERE row_version = $${actorIndex + 1} AND id = $${actorIndex + 2} RETURNING *`,
      params,
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [listProductLocations]: Lists product balances by warehouse, bin, and lot.
  async listProductLocations(productId: string, warehouseId?: string): Promise<Row[]> {
    const values: unknown[] = [productId];
    const warehouseFilter = warehouseId ? `AND sb.warehouse_id = $${values.push(warehouseId)}` : '';
    const result = await this.database.query<Row>(
      `SELECT sb.warehouse_id, w.name AS warehouse_name, sb.bin_id, b.code AS bin_code,
              sb.lot_id, il.batch_number, il.expires_at, sb.on_hand_qty, sb.reserved_qty,
              (sb.on_hand_qty - sb.reserved_qty - sb.damaged_qty - sb.quarantined_qty) AS available_qty
         FROM warehouse.stock_balances sb
         JOIN warehouse.inventory_lots il ON il.id = sb.lot_id AND il.product_id = $1
         JOIN warehouse.warehouses w ON w.id = sb.warehouse_id
         LEFT JOIN warehouse.bins b ON b.id = sb.bin_id
        WHERE w.is_deleted = false ${warehouseFilter}
        ORDER BY w.name, b.code, il.expires_at`,
      values,
    );
    return result.rows.map(mapRow);
  }

  // * Function [listProductWarehouses]: Aggregates product availability by warehouse.
  async listProductWarehouses(productId: string): Promise<Row[]> {
    const result = await this.database.query<Row>(
      `SELECT sb.warehouse_id, w.code AS warehouse_code, w.name AS warehouse_name,
              SUM(sb.on_hand_qty) AS on_hand_qty, SUM(sb.reserved_qty) AS reserved_qty,
              SUM(sb.on_hand_qty - sb.reserved_qty - sb.damaged_qty - sb.quarantined_qty) AS available_qty
         FROM warehouse.stock_balances sb
         JOIN warehouse.inventory_lots il ON il.id = sb.lot_id AND il.product_id = $1
         JOIN warehouse.warehouses w ON w.id = sb.warehouse_id AND w.is_deleted = false
        GROUP BY sb.warehouse_id, w.code, w.name ORDER BY w.name, sb.warehouse_id`,
      [productId],
    );
    return result.rows.map(mapRow);
  }

  // * Function [listWarehouseProducts]: Aggregates stocked products for one warehouse.
  async listWarehouseProducts(warehouseId: string, query: InventoryListQuery) {
    const values: unknown[] = [warehouseId];
    const where = ['sb.warehouse_id = $1', 'w.is_deleted = false'];
    if (query.search) {
      values.push(`%${query.search}%`);
      where.push(`(p.name ILIKE $${values.length} OR p.sku ILIKE $${values.length})`);
    }
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT il.product_id, il.variant_id, p.sku, p.name AS product_name,
              SUM(sb.on_hand_qty) AS on_hand_qty, SUM(sb.reserved_qty) AS reserved_qty,
              SUM(sb.on_hand_qty - sb.reserved_qty - sb.damaged_qty - sb.quarantined_qty) AS available_qty
         FROM warehouse.stock_balances sb
         JOIN warehouse.inventory_lots il ON il.id = sb.lot_id
         JOIN catalog.products p ON p.id = il.product_id AND p.is_deleted = false
         JOIN warehouse.warehouses w ON w.id = sb.warehouse_id
        WHERE ${where.join(' AND ')}
        GROUP BY il.product_id, il.variant_id, p.sku, p.name
        ORDER BY p.name, il.variant_id NULLS FIRST
        LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM (
         SELECT il.product_id, il.variant_id
           FROM warehouse.stock_balances sb
           JOIN warehouse.inventory_lots il ON il.id = sb.lot_id
           JOIN catalog.products p ON p.id = il.product_id AND p.is_deleted = false
           JOIN warehouse.warehouses w ON w.id = sb.warehouse_id
          WHERE ${where.join(' AND ')} GROUP BY il.product_id, il.variant_id
       ) grouped`,
      countValues,
    );
    return { rows: rows.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [listLedger]: Lists immutable stock-ledger movements with filters.
  async listLedger(query: Row) {
    const values: unknown[] = [];
    const where: string[] = [];
    for (const [field, value] of [
      ['warehouse_id', query.warehouseId],
      ['lot_id', query.lotId],
      ['movement_type', query.movementType],
      ['reference_type', query.referenceType],
      ['reference_id', query.referenceId],
    ] as const) {
      if (value) {
        values.push(value);
        where.push(`${field} = $${values.length}`);
      }
    }
    if (query.from) {
      values.push(query.from);
      where.push(`occurred_at >= $${values.length}`);
    }
    if (query.until) {
      values.push(query.until);
      where.push(`occurred_at < $${values.length}`);
    }
    const filter = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_ledger ${filter} ORDER BY occurred_at DESC, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM warehouse.stock_ledger ${filter}`,
      countValues,
    );
    return { rows: rows.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [findLedgerByIdempotency]: Finds a previously posted movement for safe retries.
  async findLedgerByIdempotency(key: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_ledger WHERE idempotency_key = $1 LIMIT 1`,
      [key],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [createLedger]: Inserts one auditable stock movement.
  async createLedger(values: Row): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.stock_ledger
        (warehouse_id, bin_id, lot_id, movement_type, quantity, reference_type, reference_id,
         idempotency_key, occurred_at, actor_user_id, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        values.warehouseId,
        values.binId ?? null,
        values.lotId,
        values.movementType,
        values.quantity,
        values.referenceType,
        values.referenceId,
        values.idempotencyKey,
        values.occurredAt ?? new Date(),
        values.actorUserId ?? null,
        values.notes ?? null,
      ],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [getBalanceForUpdate]: Locks one stock balance for a mutation.
  async getBalanceForUpdate(
    warehouseId: string,
    binId: string,
    lotId: string,
  ): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_balances WHERE warehouse_id = $1 AND bin_id = $2 AND lot_id = $3 FOR UPDATE`,
      [warehouseId, binId, lotId],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [listBalancesForLot]: Returns all bin balances for a lot, optionally locked.
  async listBalancesForLot(warehouseId: string, lotId: string, forUpdate = false): Promise<Row[]> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_balances
        WHERE warehouse_id = $1 AND lot_id = $2
        ORDER BY bin_id, id ${forUpdate ? 'FOR UPDATE' : ''}`,
      [warehouseId, lotId],
    );
    return result.rows.map(mapRow);
  }

  // * Function [upsertBalance]: Inserts or updates the existing warehouse stock balance.
  async upsertBalance(values: Row): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.stock_balances
        (warehouse_id, bin_id, lot_id, on_hand_qty, reserved_qty, damaged_qty, quarantined_qty, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8)
       ON CONFLICT (warehouse_id, bin_id, lot_id) DO UPDATE SET
         on_hand_qty = EXCLUDED.on_hand_qty, reserved_qty = EXCLUDED.reserved_qty,
         damaged_qty = EXCLUDED.damaged_qty, quarantined_qty = EXCLUDED.quarantined_qty,
         updated_by = EXCLUDED.updated_by, updated_at = now(), row_version = warehouse.stock_balances.row_version + 1
       RETURNING *`,
      [
        values.warehouseId,
        values.binId,
        values.lotId,
        values.onHandQty ?? '0',
        values.reservedQty ?? '0',
        values.damagedQty ?? '0',
        values.quarantinedQty ?? '0',
        values.actorUserId ?? null,
      ],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [createReservation]: Persists an active stock reservation.
  async createReservation(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.stock_reservations
        (reservation_number, order_id, order_item_id, warehouse_id, bin_id, lot_id, quantity, status, expires_at, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'active',$8,$9,$9) RETURNING *`,
      [
        values.reservationNumber,
        values.orderId,
        values.orderItemId,
        values.warehouseId,
        values.binId ?? null,
        values.lotId,
        values.quantity,
        values.expiresAt,
        actor,
      ],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [getReservation]: Retrieves or locks one reservation.
  async getReservation(id: string, forUpdate = false): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_reservations WHERE id = $1 ${forUpdate ? 'FOR UPDATE' : ''}`,
      [id],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [findReservationByNumber]: Checks the business reservation number for duplicates.
  async findReservationByNumber(reservationNumber: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_reservations WHERE reservation_number = $1 LIMIT 1`,
      [reservationNumber],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [listReservations]: Lists reservations with order, warehouse, status, and expiry filters.
  async listReservations(query: Row) {
    const values: unknown[] = [];
    const where: string[] = [];
    for (const [field, value] of [
      ['warehouse_id', query.warehouseId],
      ['order_id', query.orderId],
      ['order_item_id', query.orderItemId],
      ['status', query.status],
    ] as const) {
      if (value) {
        values.push(value);
        where.push(`${field} = $${values.length}`);
      }
    }
    if (query.expiredBefore) {
      values.push(query.expiredBefore);
      where.push(`status = 'active' AND expires_at <= $${values.length}`);
    }
    const filter = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_reservations ${filter} ORDER BY created_at DESC, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM warehouse.stock_reservations ${filter}`,
      countValues,
    );
    return { rows: rows.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [updateReservationStatus]: Records a reservation lifecycle transition and timestamp.
  async updateReservationStatus(
    id: string,
    status: string,
    actor: string | null,
  ): Promise<Row | null> {
    const field = status === 'released' || status === 'expired' ? 'released_at' : 'committed_at';
    const result = await this.database.query<Row>(
      `UPDATE warehouse.stock_reservations SET status = $2, ${field} = now(), updated_by = $3,
       updated_at = now(), row_version = row_version + 1 WHERE id = $1 RETURNING *`,
      [id, status, actor],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [expireReservations]: Provides a locked batch expiry operation for scheduled jobs.
  async expireReservations(limit: number, actor: string | null): Promise<Row[]> {
    const result = await this.database.query<Row>(
      `WITH candidates AS (
        SELECT id FROM warehouse.stock_reservations WHERE status = 'active' AND expires_at <= now()
        ORDER BY expires_at, id LIMIT $1 FOR UPDATE SKIP LOCKED
       )
       UPDATE warehouse.stock_reservations r SET status = 'expired', released_at = now(), updated_by = $2,
        updated_at = now(), row_version = row_version + 1
        FROM candidates c WHERE r.id = c.id RETURNING r.*`,
      [limit, actor],
    );
    return result.rows.map(mapRow);
  }

  // * Function [createHold]: Persists an active stock hold.
  async createHold(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.stock_holds
        (warehouse_id, bin_id, lot_id, quantity, reason_code, status, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,'active',$6,$6) RETURNING *`,
      [
        values.warehouseId,
        values.binId ?? null,
        values.lotId,
        values.quantity,
        values.reasonCode,
        actor,
      ],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [getHold]: Retrieves or locks one stock hold.
  async getHold(id: string, forUpdate = false): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_holds WHERE id = $1 ${forUpdate ? 'FOR UPDATE' : ''}`,
      [id],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [listHolds]: Lists stock holds by warehouse, lot, and lifecycle status.
  async listHolds(query: Row) {
    const values: unknown[] = [];
    const where: string[] = [];
    for (const [field, value] of [
      ['warehouse_id', query.warehouseId],
      ['lot_id', query.lotId],
      ['status', query.status],
    ] as const) {
      if (value) {
        values.push(value);
        where.push(`${field} = $${values.length}`);
      }
    }
    const filter = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_holds ${filter} ORDER BY created_at DESC, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM warehouse.stock_holds ${filter}`,
      countValues,
    );
    return { rows: rows.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [releaseHold]: Marks an active hold as released with audit metadata.
  async releaseHold(id: string, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE warehouse.stock_holds SET status = 'released', released_at = now(), released_by_user_id = $2,
       updated_by = $2, updated_at = now(), row_version = row_version + 1
       WHERE id = $1 AND status = 'active' RETURNING *`,
      [id, actor],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [createAdjustment]: Creates a posted adjustment header.
  async createAdjustment(values: Row, actor: string): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.inventory_adjustments
        (adjustment_number, warehouse_id, reason_code, status, requested_by_user_id, approved_by_user_id, posted_at, created_by, updated_by)
       VALUES ($1,$2,$3,'posted',$4,$4,now(),$4,$4) RETURNING *`,
      [values.adjustmentNumber, values.warehouseId, values.reasonCode, actor],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [createAdjustmentItem]: Creates one adjustment line for a bin and lot.
  async createAdjustmentItem(values: Row, actor: string): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.inventory_adjustment_items
        (adjustment_id, bin_id, lot_id, quantity_delta, notes, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$6) RETURNING *`,
      [
        values.adjustmentId,
        values.binId,
        values.lotId,
        values.quantityDelta,
        values.notes ?? null,
        actor,
      ],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [getAdjustment]: Retrieves one adjustment header.
  async getAdjustment(id: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.inventory_adjustments WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [listAdjustmentItems]: Retrieves the lines belonging to an adjustment.
  async listAdjustmentItems(adjustmentId: string): Promise<Row[]> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.inventory_adjustment_items WHERE adjustment_id = $1 ORDER BY id`,
      [adjustmentId],
    );
    return result.rows.map(mapRow);
  }

  // * Function [listAdjustments]: Lists adjustment headers for audit and reconciliation.
  async listAdjustments(query: Row) {
    const values: unknown[] = [];
    const where: string[] = [];
    for (const [field, value] of [
      ['warehouse_id', query.warehouseId],
      ['status', query.status],
      ['reason_code', query.reasonCode],
    ] as const) {
      if (value) {
        values.push(value);
        where.push(`${field} = $${values.length}`);
      }
    }
    const filter = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT * FROM warehouse.inventory_adjustments ${filter} ORDER BY created_at DESC, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM warehouse.inventory_adjustments ${filter}`,
      countValues,
    );
    return { rows: rows.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [createTransfer]: Creates a requested transfer header.
  async createTransfer(values: Row, actor: string): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.stock_transfers
        (transfer_number, source_warehouse_id, destination_warehouse_id, status, requested_by_user_id, created_by, updated_by)
       VALUES ($1,$2,$3,'requested',$4,$4,$4) RETURNING *`,
      [values.transferNumber, values.sourceWarehouseId, values.destinationWarehouseId, actor],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [createTransferItem]: Creates one requested lot line for a transfer.
  async createTransferItem(values: Row, actor: string): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.stock_transfer_items
        (transfer_id, lot_id, requested_qty, dispatched_qty, received_qty, created_by, updated_by)
       VALUES ($1,$2,$3,0,0,$4,$4) RETURNING *`,
      [values.transferId, values.lotId, values.requestedQuantity, actor],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [getTransfer]: Retrieves one transfer header.
  async getTransfer(id: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_transfers WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [getTransferForUpdate]: Locks one transfer during dispatch or receipt.
  async getTransferForUpdate(id: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_transfers WHERE id = $1 FOR UPDATE`,
      [id],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [findTransferByNumber]: Checks the business transfer number for duplicates.
  async findTransferByNumber(transferNumber: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_transfers WHERE transfer_number = $1 LIMIT 1`,
      [transferNumber],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [listTransfers]: Lists transfers with warehouse and lifecycle filters.
  async listTransfers(query: Row) {
    const values: unknown[] = [];
    const where: string[] = [];
    for (const [field, value] of [
      ['source_warehouse_id', query.sourceWarehouseId],
      ['destination_warehouse_id', query.destinationWarehouseId],
      ['status', query.status],
    ] as const) {
      if (value) {
        values.push(value);
        where.push(`${field} = $${values.length}`);
      }
    }
    const filter = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_transfers ${filter} ORDER BY created_at DESC, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM warehouse.stock_transfers ${filter}`,
      countValues,
    );
    return { rows: rows.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [listTransferItems]: Retrieves or locks transfer line items.
  async listTransferItems(transferId: string, forUpdate = false): Promise<Row[]> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.stock_transfer_items WHERE transfer_id = $1 ORDER BY id ${forUpdate ? 'FOR UPDATE' : ''}`,
      [transferId],
    );
    return result.rows.map(mapRow);
  }

  // * Function [updateTransferStatus]: Changes transfer lifecycle status and timestamps.
  async updateTransferStatus(
    id: string,
    status: string,
    actor: string | null,
  ): Promise<Row | null> {
    const timestamp =
      status === 'dispatched' ? 'dispatched_at' : status === 'received' ? 'received_at' : null;
    const update = timestamp ? `, ${timestamp} = now()` : '';
    const result = await this.database.query<Row>(
      `UPDATE warehouse.stock_transfers SET status = $2, updated_by = $3, updated_at = now(), row_version = row_version + 1 ${update} WHERE id = $1 RETURNING *`,
      [id, status, actor],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [updateTransferItem]: Updates dispatched and received quantities for a line.
  async updateTransferItem(id: string, values: Row, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE warehouse.stock_transfer_items SET dispatched_qty = COALESCE($2, dispatched_qty), received_qty = COALESCE($3, received_qty), updated_by = $4, updated_at = now(), row_version = row_version + 1 WHERE id = $1 RETURNING *`,
      [id, values.dispatchedQty ?? null, values.receivedQty ?? null, actor],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [createCycleCount]: Creates a scheduled cycle-count session.
  async createCycleCount(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.cycle_counts
        (warehouse_id, bin_id, status, scheduled_at, assigned_to_user_id, count_mode, created_by, updated_by)
       VALUES ($1,$2,'scheduled',$3,$4,$5,$6,$6) RETURNING *`,
      [
        values.warehouseId,
        values.binId ?? null,
        values.scheduledAt ?? new Date(),
        values.assignedToUserId ?? null,
        values.countMode ?? 'full',
        actor,
      ],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [createCycleCountItem]: Creates a count line with its system baseline quantity.
  async createCycleCountItem(values: Row, actor: string | null): Promise<Row> {
    const result = await this.database.query<Row>(
      `INSERT INTO warehouse.cycle_count_items
        (cycle_count_id, bin_id, lot_id, system_qty, counted_qty, variance_qty, reason_code, created_by, updated_by)
       VALUES ($1,$2,$3,$4,NULL,NULL,$5,$6,$6) RETURNING *`,
      [
        values.cycleCountId,
        values.binId,
        values.lotId,
        values.systemQty,
        values.reasonCode ?? null,
        actor,
      ],
    );
    return mapRow(result.rows[0]);
  }

  // * Function [getCycleCount]: Retrieves one cycle-count session.
  async getCycleCount(id: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.cycle_counts WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [getCycleCountForUpdate]: Locks one cycle-count session for lifecycle changes.
  async getCycleCountForUpdate(id: string): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.cycle_counts WHERE id = $1 FOR UPDATE`,
      [id],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [listCycleCounts]: Lists cycle-count sessions for operations dashboards.
  async listCycleCounts(query: Row) {
    const values: unknown[] = [];
    const where: string[] = [];
    for (const [field, value] of [
      ['warehouse_id', query.warehouseId],
      ['status', query.status],
      ['assigned_to_user_id', query.assignedToUserId],
    ] as const) {
      if (value) {
        values.push(value);
        where.push(`${field} = $${values.length}`);
      }
    }
    const filter = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const countValues = [...values];
    values.push(query.pageSize, (query.page - 1) * query.pageSize);
    const rows = await this.database.query<Row>(
      `SELECT * FROM warehouse.cycle_counts ${filter} ORDER BY scheduled_at DESC, id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await this.database.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM warehouse.cycle_counts ${filter}`,
      countValues,
    );
    return { rows: rows.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) };
  }

  // * Function [listCycleCountItems]: Retrieves or locks the lines in a cycle-count session.
  async listCycleCountItems(cycleCountId: string, forUpdate = false): Promise<Row[]> {
    const result = await this.database.query<Row>(
      `SELECT * FROM warehouse.cycle_count_items WHERE cycle_count_id = $1 ORDER BY id ${forUpdate ? 'FOR UPDATE' : ''}`,
      [cycleCountId],
    );
    return result.rows.map(mapRow);
  }

  // * Function [updateCycleCount]: Applies a row-version guarded count lifecycle update.
  async updateCycleCount(
    id: string,
    values: Row,
    actor: string | null,
    rowVersion: number,
  ): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE warehouse.cycle_counts SET status = COALESCE($2, status), started_at = COALESCE($3, started_at), completed_at = COALESCE($4, completed_at), updated_by = $5, updated_at = now(), row_version = row_version + 1 WHERE id = $1 AND row_version = $6 RETURNING *`,
      [
        id,
        values.status ?? null,
        values.startedAt ?? null,
        values.completedAt ?? null,
        actor,
        rowVersion,
      ],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  // * Function [updateCycleCountItem]: Stores physical quantity and calculated variance.
  async updateCycleCountItem(id: string, values: Row, actor: string | null): Promise<Row | null> {
    const result = await this.database.query<Row>(
      `UPDATE warehouse.cycle_count_items SET counted_qty = $2, variance_qty = $3, reason_code = $4, updated_by = $5, updated_at = now(), row_version = row_version + 1 WHERE id = $1 RETURNING *`,
      [id, values.countedQty, values.varianceQty, values.reasonCode ?? null, actor],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }
}

const warehouseFields: Record<string, string> = {
  name: 'name',
  warehouseType: 'warehouse_type',
  status: 'status',
  supportsColdChain: 'supports_cold_chain',
  supportsControlledDrugs: 'supports_controlled_drugs',
  operatingHours: 'operating_hours',
};

const lotFields: Record<string, string> = {
  purchaseCost: 'purchase_cost',
  mrp: 'mrp',
  qualityStatus: 'quality_status',
  recallStatus: 'recall_status',
};

// * Function [jsonValue]: Serializes JSON request values before parameterized persistence.
function jsonValue(value: unknown): unknown {
  return value && typeof value === 'object' && !(value instanceof Date)
    ? JSON.stringify(value)
    : value;
}

// * Function [mapRow]: Maps database snake_case columns to the public camelCase application shape.
function mapRow(row: Row): Row {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_match, character: string) => character.toUpperCase()),
      key === 'row_version' ? Number(value) : value,
    ]),
  );
}
