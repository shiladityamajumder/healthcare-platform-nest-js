// * Inventory module: Defines the application-to-persistence contract for warehouse workflows.
// * File: src/contracts/inventory.ports.ts
// ? Keep application inputs and repository operations independent from HTTP and SQL details.
// ! Do not add migration or ORM behavior to this contract.
/* eslint-disable @typescript-eslint/no-explicit-any */
export type InventoryRow = Record<string, any>;

/** Shared pagination values used by inventory list operations. */
export interface InventoryPageQuery {
  page: number;
  pageSize: number;
}

/** Filters used by balance and lot inventory listings. */
export interface InventoryListQuery extends InventoryPageQuery {
  productId?: string;
  variantId?: string;
  warehouseId?: string;
  qualityStatus?: string;
  inStock?: boolean;
  lowStock?: boolean;
  expiringSoon?: boolean;
  expired?: boolean;
  expiryDays: number;
  search?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/** Filters used by warehouse administration listings. */
export interface WarehouseListQuery extends InventoryPageQuery {
  search?: string;
  status?: string;
  warehouseType?: string;
  supportsColdChain?: boolean;
  supportsControlledDrugs?: boolean;
  includeDeleted: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/** Application input used to register an inventory lot. */
export interface InventoryLotCreateInput extends InventoryRow {
  warehouseId: string;
  productId: string;
  variantId?: string;
  binId: string;
  batchNumber: string;
  expiresAt: string;
  mrp: string;
  initialQuantity: string;
  idempotencyKey: string;
}

/** Persistence operations required by inventory application workflows. */
export interface InventoryRepositoryPort {
  // * Transaction and reference validation operations.
  transaction<T>(work: () => Promise<T>): Promise<T>;

  warehouseExists(id: string): Promise<boolean>;
  locationExists(id: string): Promise<boolean>;
  productExists(id: string): Promise<boolean>;
  variantMatches(id: string, productId: string): Promise<boolean>;
  binExistsForWarehouse(id: string, warehouseId: string): Promise<boolean>;

  listWarehouses(query: WarehouseListQuery): Promise<{ rows: InventoryRow[]; total: number }>;
  createWarehouse(values: InventoryRow, actor: string | null): Promise<InventoryRow>;
  getWarehouse(id: string, includeDeleted?: boolean, forUpdate?: boolean): Promise<InventoryRow | null>;
  updateWarehouse(id: string, values: InventoryRow, actor: string | null): Promise<InventoryRow | null>;
  deactivateWarehouse(id: string, actor: string | null): Promise<boolean>;
  reactivateWarehouse(id: string, actor: string | null): Promise<InventoryRow | null>;
  listWarehouseBins(warehouseId: string): Promise<InventoryRow[]>;
  listLocationHierarchy(warehouseId?: string): Promise<InventoryRow[]>;
  upsertReplenishmentRule(values: InventoryRow, actor: string | null): Promise<InventoryRow>;
  listReplenishmentRules(warehouseId: string, query: InventoryPageQuery): Promise<{ rows: InventoryRow[]; total: number }>;

  listInventory(query: InventoryListQuery): Promise<{ rows: InventoryRow[]; total: number }>;
  listLots(query: InventoryListQuery): Promise<{ rows: InventoryRow[]; total: number }>;
  createLot(values: InventoryRow, actor: string | null): Promise<InventoryRow>;
  getLot(id: string): Promise<InventoryRow | null>;
  updateLot(id: string, values: InventoryRow, actor: string | null, rowVersion: number): Promise<InventoryRow | null>;
  listProductLocations(productId: string, warehouseId?: string): Promise<InventoryRow[]>;
  listProductWarehouses(productId: string): Promise<InventoryRow[]>;
  listWarehouseInventory(warehouseId: string, query: InventoryListQuery): Promise<{ rows: InventoryRow[]; total: number }>;
  listWarehouseProducts(warehouseId: string, query: InventoryListQuery): Promise<{ rows: InventoryRow[]; total: number }>;
  listLedger(query: InventoryRow): Promise<{ rows: InventoryRow[]; total: number }>;
  findLedgerByIdempotency(key: string): Promise<InventoryRow | null>;
  createLedger(values: InventoryRow): Promise<InventoryRow>;
  getBalanceForUpdate(warehouseId: string, binId: string, lotId: string): Promise<InventoryRow | null>;
  listBalancesForLot(warehouseId: string, lotId: string, forUpdate?: boolean): Promise<InventoryRow[]>;
  upsertBalance(values: InventoryRow): Promise<InventoryRow>;

  createReservation(values: InventoryRow, actor: string | null): Promise<InventoryRow>;
  getReservation(id: string, forUpdate?: boolean): Promise<InventoryRow | null>;
  findReservationByNumber(reservationNumber: string): Promise<InventoryRow | null>;
  listReservations(query: InventoryRow): Promise<{ rows: InventoryRow[]; total: number }>;
  updateReservationStatus(id: string, status: string, actor: string | null): Promise<InventoryRow | null>;
  expireReservations(limit: number, actor: string | null): Promise<InventoryRow[]>;

  createHold(values: InventoryRow, actor: string | null): Promise<InventoryRow>;
  getHold(id: string, forUpdate?: boolean): Promise<InventoryRow | null>;
  listHolds(query: InventoryRow): Promise<{ rows: InventoryRow[]; total: number }>;
  releaseHold(id: string, actor: string | null): Promise<InventoryRow | null>;

  createAdjustment(values: InventoryRow, actor: string): Promise<InventoryRow>;
  createAdjustmentItem(values: InventoryRow, actor: string): Promise<InventoryRow>;
  getAdjustment(id: string): Promise<InventoryRow | null>;
  listAdjustmentItems(adjustmentId: string): Promise<InventoryRow[]>;
  listAdjustments(query: InventoryRow): Promise<{ rows: InventoryRow[]; total: number }>;

  createTransfer(values: InventoryRow, actor: string): Promise<InventoryRow>;
  createTransferItem(values: InventoryRow, actor: string): Promise<InventoryRow>;
  getTransfer(id: string): Promise<InventoryRow | null>;
  getTransferForUpdate(id: string): Promise<InventoryRow | null>;
  findTransferByNumber(transferNumber: string): Promise<InventoryRow | null>;
  listTransfers(query: InventoryRow): Promise<{ rows: InventoryRow[]; total: number }>;
  listTransferItems(transferId: string, forUpdate?: boolean): Promise<InventoryRow[]>;
  updateTransferStatus(id: string, status: string, actor: string | null): Promise<InventoryRow | null>;
  updateTransferItem(id: string, values: InventoryRow, actor: string | null): Promise<InventoryRow | null>;

  createCycleCount(values: InventoryRow, actor: string | null): Promise<InventoryRow>;
  createCycleCountItem(values: InventoryRow, actor: string | null): Promise<InventoryRow>;
  getCycleCount(id: string): Promise<InventoryRow | null>;
  getCycleCountForUpdate(id: string): Promise<InventoryRow | null>;
  listCycleCounts(query: InventoryRow): Promise<{ rows: InventoryRow[]; total: number }>;
  listCycleCountItems(cycleCountId: string, forUpdate?: boolean): Promise<InventoryRow[]>;
  updateCycleCount(id: string, values: InventoryRow, actor: string | null, rowVersion: number): Promise<InventoryRow | null>;
  updateCycleCountItem(id: string, values: InventoryRow, actor: string | null): Promise<InventoryRow | null>;
}

export const INVENTORY_REPOSITORY = Symbol('INVENTORY_REPOSITORY');
  // * Warehouse and replenishment operations.
  // * Inventory lot, balance, location, and ledger operations.
  // * Reservation and hold lifecycle operations.
  // * Adjustment and transfer operations.
  // * Cycle-count operations.
