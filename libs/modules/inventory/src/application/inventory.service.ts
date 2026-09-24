// * Inventory module: Coordinates stock, warehouse, reservation, transfer, and counting use cases.
// * File: src/application/inventory.service.ts
// ? Keep business rules and transaction boundaries here; keep HTTP and SQL in their own layers.
// ! This service only consumes the existing database contract and never changes schema or migrations.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable } from '@nestjs/common';
import type { InventoryRepositoryPort } from '../contracts/inventory.ports';
import { INVENTORY_REPOSITORY } from '../contracts/inventory.ports';
import {
  InventoryConflictError,
  InventoryNotFoundError,
  InventoryValidationError,
} from '../contracts/inventory.errors';

type Row = Record<string, any>;

/** Application-facing inventory workflow service used by the mounted feature handlers. */
@Injectable()
export class InventoryService {
  // * Function [constructor]: Initializes the application service with the inventory repository port.
  public constructor(
    @Inject(INVENTORY_REPOSITORY) protected readonly repository: InventoryRepositoryPort,
  ) {}

  /** Dispatches the existing controller operation names through one application boundary. */
  async execute(operation: string, input: unknown = {}, actor?: string): Promise<unknown> {
    const values = input as any;
    switch (operation) {
      case 'list-warehouses': return this.listWarehouses(values);
      case 'create-warehouse': return this.createWarehouse(values, actor);
      case 'get-warehouse': return this.getWarehouse(values.warehouseId, values.includeDeleted);
      case 'update-warehouse': return this.updateWarehouse(values, actor);
      case 'deactivate-warehouse': return this.deactivateWarehouse(values.warehouseId, actor);
      case 'reactivate-warehouse': return this.reactivateWarehouse(values.warehouseId, actor);
      case 'list-warehouse-bins': return this.listWarehouseBins(values.warehouseId);
      case 'upsert-replenishment-rule': return this.upsertReplenishmentRule(values, actor);
      case 'list-replenishment-rules': return this.listReplenishmentRules(values);
      case 'list-inventory': return this.listInventory(values);
      case 'list-lots': return this.listLots(values);
      case 'create-lot': return this.createLot(values, actor);
      case 'update-lot': return this.updateLot(values.lotId, values, actor);
      case 'get-lot': return this.getLot(values.lotId);
      case 'adjust': return this.adjust(values, actor);
      case 'list-adjustments': return this.listAdjustments(values);
      case 'get-adjustment': return this.getAdjustment(values.adjustmentId);
      case 'reserve': return this.reserve(values, actor);
      case 'list-reservations': return this.listReservations(values);
      case 'get-reservation': return this.getReservation(values.reservationId);
      case 'expire-reservations': return this.expireReservations(values.limit ?? 100, actor);
      case 'release-reservation': return this.changeReservation(values.reservationId, 'released', actor);
      case 'commit-reservation': return this.changeReservation(values.reservationId, 'committed', actor);
      case 'create-hold': return this.createHold(values, actor);
      case 'list-holds': return this.listHolds(values);
      case 'get-hold': return this.getHold(values.holdId);
      case 'release-hold': return this.releaseHold(values.holdId, actor);
      case 'list-locations': return this.listLocations(values.warehouseId);
      case 'relocate': return this.relocate(values, actor);
      case 'list-ledger': return this.listLedger(values);
      case 'create-transfer': return this.createTransfer(values, actor);
      case 'list-transfers': return this.listTransfers(values);
      case 'get-transfer': return this.getTransfer(values.transferId);
      case 'dispatch-transfer': return this.dispatchTransfer(values.transferId, actor);
      case 'receive-transfer': return this.receiveTransfer(values, actor);
      case 'product-inventory': return this.repository.listProductLocations(values.productId, values.warehouseId);
      case 'product-warehouses': return this.repository.listProductWarehouses(values.productId);
      case 'warehouse-inventory': return this.page(this.repository.listWarehouseInventory(values.warehouseId, inventoryQuery(values)), values);
      case 'warehouse-products': return this.page(this.repository.listWarehouseProducts(values.warehouseId, inventoryQuery(values)), values);
      case 'create-cycle-count': return this.createCycleCount(values, actor);
      case 'list-cycle-counts': return this.listCycleCounts(values);
      case 'get-cycle-count': return this.getCycleCount(values.cycleCountId);
      case 'update-cycle-count': return this.updateCycleCount(values, actor);
      case 'add-cycle-count-item': return this.addCycleCountItem(values, actor);
      case 'count-cycle-count-item': return this.countCycleCountItem(values, actor);
      default: throw new InventoryValidationError(`Unsupported inventory operation: ${operation}.`);
    }
  }

  // * Function [listInventory]: Returns paginated stock balances for inventory and fulfilment screens.
  async listInventory(input: Row) {
    const query = inventoryQuery(input);
    return this.page(this.repository.listInventory(query), query);
  }

  // * Function [listWarehouses]: Returns paginated warehouses using capability and lifecycle filters.
  async listWarehouses(input: Row) {
    const query = {
      ...input,
      page: Number(input.page ?? 1),
      pageSize: Number(input.pageSize ?? 20),
      includeDeleted: Boolean(input.includeDeleted),
      sortBy: input.sortBy ?? 'name',
      sortOrder: input.sortOrder === 'desc' ? 'desc' : 'asc',
    } as any;
    return this.page(this.repository.listWarehouses(query), query);
  }

  // * Function [createWarehouse]: Creates a warehouse after validating its organization location.
  async createWarehouse(input: Row, actor?: string) {
    return this.repository.transaction(async () => {
      await this.assertLocation(input.locationId);
      return this.repository.createWarehouse(input, actor ?? null);
    });
  }

  // * Function [getWarehouse]: Retrieves one active or optionally deleted warehouse.
  async getWarehouse(id: string, includeDeleted = false) {
    const row = await this.repository.getWarehouse(id, includeDeleted);
    if (!row) throw new InventoryNotFoundError('WAREHOUSE_NOT_FOUND', 'The warehouse was not found.');
    return row;
  }

  // * Function [updateWarehouse]: Applies an optimistic-locked warehouse update.
  async updateWarehouse(input: Row, actor?: string) {
    if (!Number.isInteger(Number(input.rowVersion))) throw new InventoryValidationError('rowVersion is required for warehouse updates.');
    const current = await this.repository.getWarehouse(input.warehouseId, false, true);
    if (!current) throw new InventoryNotFoundError('WAREHOUSE_NOT_FOUND', 'The warehouse was not found.');
    if (Number(current.rowVersion) !== Number(input.rowVersion)) throw new InventoryConflictError('CONCURRENT_UPDATE', 'The warehouse changed after it was loaded.', { currentRowVersion: current.rowVersion });
    const values = patch(input, ['warehouseId', 'rowVersion']);
    if (!Object.keys(values).length) throw new InventoryValidationError('At least one mutable warehouse field must be provided.');
    const row = await this.repository.updateWarehouse(input.warehouseId, values, actor ?? null);
    if (!row) throw new InventoryConflictError('CONCURRENT_UPDATE', 'The warehouse changed after it was loaded.');
    return row;
  }

  // * Function [deactivateWarehouse]: Soft-deactivates a warehouse while preserving history.
  async deactivateWarehouse(id: string, actor?: string) {
    const changed = await this.repository.transaction(() => this.repository.deactivateWarehouse(id, actor ?? null));
    if (!changed) throw new InventoryNotFoundError('WAREHOUSE_NOT_FOUND', 'The warehouse was not found or is already inactive.');
    return { message: 'The warehouse has been deactivated.' };
  }

  // * Function [reactivateWarehouse]: Restores a previously deactivated warehouse.
  async reactivateWarehouse(id: string, actor?: string) {
    const row = await this.repository.transaction(() => this.repository.reactivateWarehouse(id, actor ?? null));
    if (!row) throw new InventoryNotFoundError('WAREHOUSE_NOT_FOUND', 'The deleted warehouse was not found.');
    return row;
  }

  // * Function [listWarehouseBins]: Lists active bins with their warehouse hierarchy context.
  async listWarehouseBins(id: string) {
    await this.assertWarehouse(id);
    return this.repository.listWarehouseBins(id);
  }

  // * Function [upsertReplenishmentRule]: Validates and saves a product replenishment rule.
  async upsertReplenishmentRule(input: Row, actor?: string) {
    const minimum = number(input.minimumQuantity);
    const maximum = number(input.maximumQuantity);
    const reorder = number(input.reorderQuantity);
    if (minimum < 0 || maximum < minimum || reorder <= 0) throw new InventoryValidationError('Replenishment quantities must satisfy 0 <= minimumQuantity <= maximumQuantity and reorderQuantity > 0.');
    await this.assertWarehouse(input.warehouseId);
    await this.assertProductAndVariant(input.productId, input.variantId);
    return this.repository.transaction(() => this.repository.upsertReplenishmentRule(input, actor ?? null));
  }

  // * Function [listReplenishmentRules]: Returns paginated replenishment rules for a warehouse.
  async listReplenishmentRules(input: Row) {
    await this.assertWarehouse(input.warehouseId);
    const query = pageQuery(input);
    return this.page(this.repository.listReplenishmentRules(input.warehouseId, query), query);
  }

  // * Function [listLots]: Returns lot-level stock, quality, and expiry information.
  async listLots(input: Row) {
    const query = inventoryQuery(input);
    return this.page(this.repository.listLots(query), query);
  }

  // * Function [createLot]: Registers a lot and optionally posts its initial receipt movement.
  async createLot(input: Row, actor?: string) {
    positive(input.initialQuantity, 'initialQuantity', true);
    positive(input.mrp, 'mrp');
    return this.repository.transaction(async () => {
      await this.assertWarehouse(input.warehouseId);
      await this.assertProductAndVariant(input.productId, input.variantId);
      await this.assertBin(input.binId, input.warehouseId);
      const existingMovement = await this.repository.findLedgerByIdempotency(input.idempotencyKey);
      if (existingMovement) return existingMovement;
      const lot = await this.repository.createLot(input, actor ?? null);
      const quantity = number(input.initialQuantity);
      if (quantity > 0) {
        await this.repository.upsertBalance({
          warehouseId: input.warehouseId,
          binId: input.binId,
          lotId: lot.id,
          onHandQty: decimal(quantity),
          reservedQty: '0',
          damagedQty: '0',
          quarantinedQty: '0',
          actorUserId: actor ?? null,
        });
        await this.repository.createLedger({
          warehouseId: input.warehouseId,
          binId: input.binId,
          lotId: lot.id,
          movementType: 'receipt',
          quantity: decimal(quantity),
          referenceType: 'inventory_lot',
          referenceId: lot.id,
          idempotencyKey: input.idempotencyKey,
          actorUserId: actor ?? null,
        });
      }
      return lot;
    });
  }

  // * Function [getLot]: Retrieves one inventory lot by UUID.
  async getLot(id: string) {
    const row = await this.repository.getLot(id);
    if (!row) throw new InventoryNotFoundError('LOT_NOT_FOUND', 'The inventory lot was not found.');
    return row;
  }

  // * Function [updateLot]: Updates mutable lot fields using optimistic locking.
  async updateLot(id: string, input: Row, actor?: string) {
    if (!Number.isInteger(Number(input.rowVersion))) throw new InventoryValidationError('rowVersion is required for lot updates.');
    const row = await this.repository.updateLot(id, patch(input, ['lotId', 'rowVersion']), actor ?? null, Number(input.rowVersion));
    if (!row) throw new InventoryConflictError('CONCURRENT_UPDATE', 'The lot changed after it was loaded, or it does not exist.');
    return row;
  }

  // * Function [adjust]: Posts a signed stock adjustment and matching ledger entry atomically.
  async adjust(input: Row, actor?: string) {
    const userId = requiredActor(actor);
    const quantity = number(input.quantityDelta);
    if (quantity === 0) throw new InventoryValidationError('quantityDelta cannot be zero.');
    return this.repository.transaction(async () => {
      await this.assertWarehouse(input.warehouseId);
      await this.assertBin(input.binId, input.warehouseId);
      await this.assertLot(input.lotId, input.warehouseId);
      const existing = await this.repository.findLedgerByIdempotency(input.idempotencyKey);
      if (existing) return existing;
      const balance = await this.repository.getBalanceForUpdate(input.warehouseId, input.binId, input.lotId);
      const currentOnHand = balance ? number(balance.onHandQty) : 0;
      if (currentOnHand + quantity < 0) throw new InventoryConflictError('INSUFFICIENT_STOCK', 'The adjustment would make on-hand stock negative.');
      const adjustment = await this.repository.createAdjustment({
        adjustmentNumber: numberId('ADJ'), warehouseId: input.warehouseId, reasonCode: input.reasonCode,
      }, userId);
      await this.repository.createAdjustmentItem({ ...input, adjustmentId: adjustment.id, quantityDelta: decimal(quantity) }, userId);
      const next = await this.repository.upsertBalance({
        warehouseId: input.warehouseId, binId: input.binId, lotId: input.lotId,
        onHandQty: decimal(currentOnHand + quantity), reservedQty: balance?.reservedQty ?? '0',
        damagedQty: balance?.damagedQty ?? '0', quarantinedQty: balance?.quarantinedQty ?? '0', actorUserId: userId,
      });
      await this.repository.createLedger({
        warehouseId: input.warehouseId, binId: input.binId, lotId: input.lotId,
        movementType: 'adjustment', quantity: decimal(quantity), referenceType: 'inventory_adjustment',
        referenceId: adjustment.id, idempotencyKey: input.idempotencyKey, actorUserId: userId, notes: input.notes,
      });
      return { ...adjustment, item: input, balance: next };
    });
  }

  // * Function [listAdjustments]: Returns paginated adjustment headers for reconciliation.
  async listAdjustments(input: Row) {
    const query = pageQuery(input);
    return this.page(this.repository.listAdjustments({ ...input, ...query }), query);
  }

  // * Function [getAdjustment]: Retrieves an adjustment with its line items.
  async getAdjustment(id: string) {
    const row = await this.repository.getAdjustment(id);
    if (!row) throw new InventoryNotFoundError('ADJUSTMENT_NOT_FOUND', 'The inventory adjustment was not found.');
    return { ...row, items: await this.repository.listAdjustmentItems(id) };
  }

  // * Function [reserve]: Moves available stock into an order reservation atomically.
  async reserve(input: Row, actor?: string) {
    positive(input.quantity, 'quantity');
    if (new Date(input.expiresAt).getTime() <= Date.now()) throw new InventoryValidationError('expiresAt must be in the future.');
    return this.repository.transaction(async () => {
      await this.assertWarehouse(input.warehouseId);
      await this.assertBin(input.binId, input.warehouseId);
      await this.assertLot(input.lotId, input.warehouseId);
      const duplicate = await this.repository.findReservationByNumber(input.reservationNumber);
      if (duplicate) throw new InventoryConflictError('RESERVATION_ALREADY_EXISTS', 'The reservation number already exists.');
      const balance = await this.requireBalance(input.warehouseId, input.binId, input.lotId);
      const available = availableQuantity(balance);
      const quantity = number(input.quantity);
      if (available < quantity) throw new InventoryConflictError('INSUFFICIENT_STOCK', 'There is not enough available stock to reserve.');
      const reservation = await this.repository.createReservation(input, actor ?? null);
      await this.repository.upsertBalance({ ...balance, reservedQty: decimal(number(balance.reservedQty) + quantity), actorUserId: actor ?? null });
      await this.repository.createLedger({
        warehouseId: input.warehouseId, binId: input.binId, lotId: input.lotId,
        movementType: 'reservation', quantity: decimal(quantity), referenceType: 'stock_reservation',
        referenceId: reservation.id, idempotencyKey: `reservation:${reservation.id}`, actorUserId: actor ?? null,
      });
      return reservation;
    });
  }

  // * Function [listReservations]: Returns reservation records for order and fulfilment views.
  async listReservations(input: Row) {
    const query = pageQuery(input);
    return this.page(this.repository.listReservations({ ...input, ...query }), query);
  }

  // * Function [getReservation]: Retrieves one reservation and its current lifecycle state.
  async getReservation(id: string) {
    const row = await this.repository.getReservation(id);
    if (!row) throw new InventoryNotFoundError('RESERVATION_NOT_FOUND', 'The stock reservation was not found.');
    return row;
  }

  // * Function [expireReservations]: Releases expired active reservations in one transaction.
  async expireReservations(limit: number, actor?: string) {
    const expired = await this.repository.transaction(async () => {
      const candidates = await this.repository.listReservations({ status: 'active', expiredBefore: new Date(), page: 1, pageSize: limit });
      const results: Row[] = [];
      for (const candidate of candidates.rows) results.push(await this.releaseReservationInTransaction(candidate.id, 'expired', actor));
      return results;
    });
    return { data: { items: expired }, pagination: { totalCount: expired.length, limit, offset: 0, hasNext: false } };
  }

  // * Function [changeReservation]: Releases or commits one active reservation safely.
  async changeReservation(id: string, status: 'released' | 'committed', actor?: string) {
    return this.repository.transaction(() => this.releaseReservationInTransaction(id, status, actor));
  }

  // * Function [releaseReservationInTransaction]: Applies the locked reservation state transition and stock movement.
  private async releaseReservationInTransaction(id: string, status: 'released' | 'committed' | 'expired', actor?: string) {
    const reservation = await this.repository.getReservation(id, true);
    if (!reservation) throw new InventoryNotFoundError('RESERVATION_NOT_FOUND', 'The stock reservation was not found.');
    if (reservation.status === status) return reservation;
    if (reservation.status !== 'active') throw new InventoryConflictError('INVALID_RESERVATION_STATE', `An ${reservation.status} reservation cannot be changed.`);
    const balance = await this.requireBalance(reservation.warehouseId, reservation.binId, reservation.lotId);
    const quantity = number(reservation.quantity);
    const onHand = number(balance.onHandQty) - (status === 'committed' ? quantity : 0);
    if (onHand < 0) throw new InventoryConflictError('INSUFFICIENT_STOCK', 'The reservation cannot be committed because stock is no longer available.');
    const next = await this.repository.upsertBalance({
      ...balance, onHandQty: decimal(onHand), reservedQty: decimal(number(balance.reservedQty) - quantity), actorUserId: actor ?? null,
    });
    const updated = await this.repository.updateReservationStatus(id, status, actor ?? null);
    if (!updated) throw new InventoryConflictError('RESERVATION_UPDATE_FAILED', 'The reservation state could not be updated.');
    await this.repository.createLedger({
      warehouseId: reservation.warehouseId, binId: reservation.binId, lotId: reservation.lotId,
      movementType: status === 'committed' ? 'reservation_commit' : 'reservation_release', quantity: decimal(status === 'committed' ? -quantity : 0),
      referenceType: 'stock_reservation', referenceId: id, idempotencyKey: `reservation:${id}:${status}`, actorUserId: actor ?? null,
    });
    return { ...updated, balance: next };
  }

  // * Function [createHold]: Places available stock into a quarantined operational hold.
  async createHold(input: Row, actor?: string) {
    positive(input.quantity, 'quantity');
    return this.repository.transaction(async () => {
      await this.assertWarehouse(input.warehouseId);
      await this.assertBin(input.binId, input.warehouseId);
      await this.assertLot(input.lotId, input.warehouseId);
      const balance = await this.requireBalance(input.warehouseId, input.binId, input.lotId);
      const quantity = number(input.quantity);
      if (availableQuantity(balance) < quantity) throw new InventoryConflictError('INSUFFICIENT_STOCK', 'There is not enough available stock to place the hold.');
      const hold = await this.repository.createHold(input, actor ?? null);
      await this.repository.upsertBalance({ ...balance, quarantinedQty: decimal(number(balance.quarantinedQty) + quantity), actorUserId: actor ?? null });
      await this.repository.createLedger({
        warehouseId: input.warehouseId, binId: input.binId, lotId: input.lotId, movementType: 'hold', quantity: decimal(quantity),
        referenceType: 'stock_hold', referenceId: hold.id, idempotencyKey: `hold:${hold.id}`, actorUserId: actor ?? null,
      });
      return hold;
    });
  }

  // * Function [listHolds]: Returns active and historical inventory holds.
  async listHolds(input: Row) {
    const query = pageQuery(input);
    return this.page(this.repository.listHolds({ ...input, ...query }), query);
  }

  // * Function [getHold]: Retrieves one inventory hold by UUID.
  async getHold(id: string) {
    const row = await this.repository.getHold(id);
    if (!row) throw new InventoryNotFoundError('HOLD_NOT_FOUND', 'The inventory hold was not found.');
    return row;
  }

  // * Function [releaseHold]: Returns held quantity to available stock and closes the hold.
  async releaseHold(id: string, actor?: string) {
    return this.repository.transaction(async () => {
      const hold = await this.repository.getHold(id, true);
      if (!hold) throw new InventoryNotFoundError('HOLD_NOT_FOUND', 'The inventory hold was not found.');
      if (hold.status !== 'active') throw new InventoryConflictError('INVALID_HOLD_STATE', 'Only an active hold can be released.');
      const balance = await this.requireBalance(hold.warehouseId, hold.binId, hold.lotId);
      const quantity = number(hold.quantity);
      const next = await this.repository.upsertBalance({ ...balance, quarantinedQty: decimal(number(balance.quarantinedQty) - quantity), actorUserId: actor ?? null });
      const released = await this.repository.releaseHold(id, actor ?? null);
      if (!released) throw new InventoryConflictError('HOLD_UPDATE_FAILED', 'The hold could not be released.');
      await this.repository.createLedger({ warehouseId: hold.warehouseId, binId: hold.binId, lotId: hold.lotId, movementType: 'hold_release', quantity: decimal(0), referenceType: 'stock_hold', referenceId: id, idempotencyKey: `hold:${id}:release`, actorUserId: actor ?? null });
      return { ...released, balance: next };
    });
  }

  // * Function [listLocations]: Returns warehouse zone, aisle, rack, and bin hierarchy.
  async listLocations(warehouseId?: string) {
    return this.repository.listLocationHierarchy(warehouseId);
  }

  // * Function [relocate]: Moves available stock between bins with paired ledger movements.
  async relocate(input: Row, actor?: string) {
    positive(input.quantity, 'quantity');
    if (input.sourceBinId === input.destinationBinId) throw new InventoryValidationError('sourceBinId and destinationBinId must be different.');
    return this.repository.transaction(async () => {
      const previous = await this.repository.findLedgerByIdempotency(`${input.idempotencyKey}:out`);
      if (previous) return previous;
      await this.assertWarehouse(input.warehouseId);
      await this.assertBin(input.sourceBinId, input.warehouseId);
      await this.assertBin(input.destinationBinId, input.warehouseId);
      const source = await this.requireBalance(input.warehouseId, input.sourceBinId, input.lotId);
      const quantity = number(input.quantity);
      if (availableQuantity(source) < quantity) throw new InventoryConflictError('INSUFFICIENT_STOCK', 'There is not enough available stock to relocate.');
      const destination = await this.repository.getBalanceForUpdate(input.warehouseId, input.destinationBinId, input.lotId);
      await this.repository.upsertBalance({ ...source, onHandQty: decimal(number(source.onHandQty) - quantity), actorUserId: actor ?? null });
      await this.repository.upsertBalance({
        warehouseId: input.warehouseId, binId: input.destinationBinId, lotId: input.lotId,
        onHandQty: decimal(number(destination?.onHandQty ?? 0) + quantity), reservedQty: destination?.reservedQty ?? '0',
        damagedQty: destination?.damagedQty ?? '0', quarantinedQty: destination?.quarantinedQty ?? '0', actorUserId: actor ?? null,
      });
      await this.repository.createLedger({ warehouseId: input.warehouseId, binId: input.sourceBinId, lotId: input.lotId, movementType: 'relocation_out', quantity: decimal(-quantity), referenceType: 'stock_relocation', referenceId: input.referenceId ?? null, idempotencyKey: `${input.idempotencyKey}:out`, actorUserId: actor ?? null });
      await this.repository.createLedger({ warehouseId: input.warehouseId, binId: input.destinationBinId, lotId: input.lotId, movementType: 'relocation_in', quantity: decimal(quantity), referenceType: 'stock_relocation', referenceId: input.referenceId ?? null, idempotencyKey: `${input.idempotencyKey}:in`, actorUserId: actor ?? null });
      return { message: 'Stock relocated successfully.' };
    });
  }

  // * Function [listLedger]: Returns immutable stock movements for audit and reconciliation.
  async listLedger(input: Row) {
    const query = pageQuery(input);
    return this.page(this.repository.listLedger({ ...input, ...query }), query);
  }

  // * Function [createTransfer]: Creates a requested warehouse-to-warehouse stock transfer.
  async createTransfer(input: Row, actor?: string) {
    const userId = requiredActor(actor);
    if (input.sourceWarehouseId === input.destinationWarehouseId) throw new InventoryValidationError('Source and destination warehouses must be different.');
    return this.repository.transaction(async () => {
      await this.assertWarehouse(input.sourceWarehouseId);
      await this.assertWarehouse(input.destinationWarehouseId);
      if (await this.repository.findTransferByNumber(input.transferNumber)) throw new InventoryConflictError('TRANSFER_ALREADY_EXISTS', 'The transfer number already exists.');
      const transfer = await this.repository.createTransfer(input, userId);
      const items: Row[] = [];
      for (const item of (input.items ?? []) as Row[]) {
        positive(item.requestedQuantity, 'requestedQuantity');
        await this.assertLot(item.lotId, input.sourceWarehouseId);
        items.push(await this.repository.createTransferItem({ transferId: transfer.id, ...item }, userId));
      }
      return { ...transfer, items };
    });
  }

  // * Function [listTransfers]: Returns paginated warehouse transfer headers.
  async listTransfers(input: Row) {
    const query = pageQuery(input);
    return this.page(this.repository.listTransfers({ ...input, ...query }), query);
  }

  // * Function [getTransfer]: Retrieves a transfer header with its line items.
  async getTransfer(id: string) {
    const row = await this.repository.getTransfer(id);
    if (!row) throw new InventoryNotFoundError('TRANSFER_NOT_FOUND', 'The stock transfer was not found.');
    return { ...row, items: await this.repository.listTransferItems(id) };
  }

  // * Function [dispatchTransfer]: Allocates source stock and dispatches a transfer atomically.
  async dispatchTransfer(id: string, actor?: string) {
    const userId = requiredActor(actor);
    return this.repository.transaction(async () => {
      const transfer = await this.repository.getTransferForUpdate(id);
      if (!transfer) throw new InventoryNotFoundError('TRANSFER_NOT_FOUND', 'The stock transfer was not found.');
      if (transfer.status === 'dispatched' || transfer.status === 'in_transit' || transfer.status === 'received') return this.getTransfer(id);
      if (transfer.status !== 'requested' && transfer.status !== 'approved') throw new InventoryConflictError('INVALID_TRANSFER_STATE', `A ${transfer.status} transfer cannot be dispatched.`);
      const items = await this.repository.listTransferItems(id, true);
      for (const item of items) {
        let remaining = number(item.requestedQty);
        const balances = await this.repository.listBalancesForLot(transfer.sourceWarehouseId, item.lotId, true);
        for (const balance of balances) {
          const available = availableQuantity(balance);
          const dispatched = Math.min(available, remaining);
          if (dispatched <= 0) continue;
          await this.repository.upsertBalance({ ...balance, onHandQty: decimal(number(balance.onHandQty) - dispatched), actorUserId: userId });
          await this.repository.createLedger({ warehouseId: transfer.sourceWarehouseId, binId: balance.binId, lotId: item.lotId, movementType: 'transfer_out', quantity: decimal(-dispatched), referenceType: 'stock_transfer', referenceId: id, idempotencyKey: `transfer:${id}:out:${item.id}:${balance.binId}`, actorUserId: userId });
          remaining -= dispatched;
          if (remaining <= 0) break;
        }
        if (remaining > 0) throw new InventoryConflictError('INSUFFICIENT_STOCK', `There is not enough stock for transfer item ${item.id}.`);
        await this.repository.updateTransferItem(item.id, { dispatchedQty: item.requestedQty }, userId);
      }
      await this.repository.updateTransferStatus(id, 'dispatched', userId);
      return this.getTransfer(id);
    });
  }

  // * Function [receiveTransfer]: Posts received quantities into destination bins idempotently.
  async receiveTransfer(input: Row, actor?: string) {
    const userId = requiredActor(actor);
    return this.repository.transaction(async () => {
      const transfer = await this.repository.getTransferForUpdate(input.transferId);
      if (!transfer) throw new InventoryNotFoundError('TRANSFER_NOT_FOUND', 'The stock transfer was not found.');
      if (transfer.status !== 'dispatched' && transfer.status !== 'in_transit') throw new InventoryConflictError('INVALID_TRANSFER_STATE', 'Only a dispatched transfer can be received.');
      const transferItems = await this.repository.listTransferItems(input.transferId, true);
      const byId = new Map(transferItems.map((item) => [item.id, item]));
      for (const itemInput of (input.items ?? []) as Row[]) {
        const item = byId.get(itemInput.transferItemId);
        if (!item) throw new InventoryNotFoundError('TRANSFER_ITEM_NOT_FOUND', 'A transfer item was not found.');
        if (await this.repository.findLedgerByIdempotency(`${input.idempotencyKey}:${item.id}`)) continue;
        const quantity = number(itemInput.receivedQuantity);
        positive(quantity, 'receivedQuantity');
        const remaining = number(item.dispatchedQty) - number(item.receivedQty);
        if (quantity > remaining) throw new InventoryValidationError('receivedQuantity cannot exceed the dispatched quantity.');
        await this.assertBin(itemInput.destinationBinId, transfer.destinationWarehouseId);
        const balance = await this.repository.getBalanceForUpdate(transfer.destinationWarehouseId, itemInput.destinationBinId, item.lotId);
        await this.repository.upsertBalance({ warehouseId: transfer.destinationWarehouseId, binId: itemInput.destinationBinId, lotId: item.lotId, onHandQty: decimal(number(balance?.onHandQty ?? 0) + quantity), reservedQty: balance?.reservedQty ?? '0', damagedQty: balance?.damagedQty ?? '0', quarantinedQty: balance?.quarantinedQty ?? '0', actorUserId: userId });
        await this.repository.createLedger({ warehouseId: transfer.destinationWarehouseId, binId: itemInput.destinationBinId, lotId: item.lotId, movementType: 'transfer_in', quantity: decimal(quantity), referenceType: 'stock_transfer', referenceId: input.transferId, idempotencyKey: `${input.idempotencyKey}:${item.id}`, actorUserId: userId });
        await this.repository.updateTransferItem(item.id, { receivedQty: decimal(number(item.receivedQty) + quantity) }, userId);
        item.receivedQty = number(item.receivedQty) + quantity;
      }
      const complete = transferItems.every((item) => number(item.receivedQty) >= number(item.dispatchedQty));
      await this.repository.updateTransferStatus(input.transferId, complete ? 'received' : 'in_transit', userId);
      return this.getTransfer(input.transferId);
    });
  }

  // * Function [createCycleCount]: Starts a scheduled warehouse or bin cycle count.
  async createCycleCount(input: Row, actor?: string) {
    if (input.warehouseId) await this.assertWarehouse(input.warehouseId);
    if (input.binId) await this.assertBin(input.binId, input.warehouseId);
    return this.repository.createCycleCount(input, actor ?? null);
  }

  // * Function [listCycleCounts]: Returns paginated cycle-count sessions.
  async listCycleCounts(input: Row) {
    const query = pageQuery(input);
    return this.page(this.repository.listCycleCounts({ ...input, ...query }), query);
  }

  // * Function [getCycleCount]: Retrieves a cycle-count session and its lines.
  async getCycleCount(id: string) {
    const row = await this.repository.getCycleCount(id);
    if (!row) throw new InventoryNotFoundError('CYCLE_COUNT_NOT_FOUND', 'The cycle count was not found.');
    return { ...row, items: await this.repository.listCycleCountItems(id) };
  }

  // * Function [updateCycleCount]: Updates a count lifecycle and posts completion variances.
  async updateCycleCount(input: Row, actor?: string) {
    return this.repository.transaction(async () => {
      const current = await this.repository.getCycleCountForUpdate(input.cycleCountId);
      if (!current) throw new InventoryNotFoundError('CYCLE_COUNT_NOT_FOUND', 'The cycle count was not found.');
      if (current.status === 'completed' && input.status === 'completed') throw new InventoryConflictError('CYCLE_COUNT_ALREADY_COMPLETED', 'The cycle count has already been completed.');
      if (Number(current.rowVersion) !== Number(input.rowVersion)) throw new InventoryConflictError('CONCURRENT_UPDATE', 'The cycle count changed after it was loaded.', { currentRowVersion: current.rowVersion });
      if (input.status === 'completed') {
        const userId = requiredActor(actor);
        const items = await this.repository.listCycleCountItems(input.cycleCountId, true);
        for (const item of items) {
          const variance = number(item.varianceQty ?? 0);
          if (variance === 0) continue;
          const balance = await this.requireBalance(current.warehouseId, item.binId, item.lotId);
          const onHand = number(balance.onHandQty) + variance;
          if (onHand < 0) throw new InventoryConflictError('INVALID_COUNT_VARIANCE', `Cycle-count variance would make stock negative for item ${item.id}.`);
          await this.repository.upsertBalance({ ...balance, onHandQty: decimal(onHand), actorUserId: userId });
          await this.repository.createLedger({ warehouseId: current.warehouseId, binId: item.binId, lotId: item.lotId, movementType: 'cycle_count_adjustment', quantity: decimal(variance), referenceType: 'cycle_count', referenceId: input.cycleCountId, idempotencyKey: `cycle-count:${input.cycleCountId}:${item.id}`, actorUserId: userId });
        }
      }
      const row = await this.repository.updateCycleCount(input.cycleCountId, input, actor ?? null, Number(input.rowVersion));
      if (!row) throw new InventoryConflictError('CONCURRENT_UPDATE', 'The cycle count changed after it was loaded.');
      return row;
    });
  }

  // * Function [addCycleCountItem]: Adds a counted bin/lot line using the current system quantity.
  async addCycleCountItem(input: Row, actor?: string) {
    const count = await this.repository.getCycleCount(input.cycleCountId);
    if (!count) throw new InventoryNotFoundError('CYCLE_COUNT_NOT_FOUND', 'The cycle count was not found.');
    await this.assertBin(input.binId, count.warehouseId);
    await this.assertLot(input.lotId, count.warehouseId);
    const balance = await this.repository.getBalanceForUpdate(count.warehouseId, input.binId, input.lotId);
    return this.repository.createCycleCountItem({ ...input, systemQty: balance?.onHandQty ?? '0' }, actor ?? null);
  }

  // * Function [countCycleCountItem]: Records physical quantity and calculates line variance.
  async countCycleCountItem(input: Row, actor?: string) {
    const counted = number(input.countedQty);
    const item = await this.repository.listCycleCountItems(input.cycleCountId).then((items) => items.find((candidate) => candidate.id === input.itemId));
    if (!item) throw new InventoryNotFoundError('CYCLE_COUNT_ITEM_NOT_FOUND', 'The cycle-count item was not found.');
    return this.repository.updateCycleCountItem(input.itemId, { countedQty: decimal(counted), varianceQty: decimal(counted - number(item.systemQty)), reasonCode: input.reasonCode }, actor ?? null);
  }

  // * Function [assertWarehouse]: Confirms that an active warehouse exists before use.
  protected async assertWarehouse(id: string) {
    if (!(await this.repository.warehouseExists(id))) throw new InventoryNotFoundError('WAREHOUSE_NOT_FOUND', 'The warehouse was not found.');
  }

  // * Function [assertLocation]: Confirms that the referenced organization location exists.
  protected async assertLocation(id: string) {
    if (!(await this.repository.locationExists(id))) throw new InventoryNotFoundError('LOCATION_NOT_FOUND', 'The organization location was not found.');
  }

  // * Function [assertProductAndVariant]: Validates product existence and variant ownership.
  protected async assertProductAndVariant(productId: string, variantId?: string) {
    if (!(await this.repository.productExists(productId))) throw new InventoryNotFoundError('PRODUCT_NOT_FOUND', 'The product was not found.');
    if (variantId && !(await this.repository.variantMatches(variantId, productId))) throw new InventoryValidationError('The variant does not belong to the product.');
  }

  // * Function [assertBin]: Confirms that a bin belongs to the selected warehouse.
  protected async assertBin(binId: string, warehouseId: string) {
    if (!(await this.repository.binExistsForWarehouse(binId, warehouseId))) throw new InventoryNotFoundError('BIN_NOT_FOUND', 'The bin was not found in the selected warehouse.');
  }

  // * Function [assertLot]: Confirms lot existence and optional warehouse ownership.
  protected async assertLot(lotId: string, warehouseId?: string) {
    const lot = await this.repository.getLot(lotId);
    if (!lot) throw new InventoryNotFoundError('LOT_NOT_FOUND', 'The inventory lot was not found.');
    if (warehouseId && lot.warehouseId !== warehouseId) throw new InventoryValidationError('The lot does not belong to the selected warehouse.');
    return lot;
  }

  // * Function [requireBalance]: Locks and returns the stock balance required by a mutation.
  protected async requireBalance(warehouseId: string, binId: string, lotId: string) {
    const row = await this.repository.getBalanceForUpdate(warehouseId, binId, lotId);
    if (!row) throw new InventoryNotFoundError('BALANCE_NOT_FOUND', 'No stock balance exists for the selected bin and lot.');
    return row;
  }

  // * Function [page]: Converts repository rows into the platform pagination envelope.
  private page(result: Promise<{ rows: Row[]; total: number }>, query: Row) {
    return result.then(({ rows, total }) => {
      const page = Number(query.page ?? 1);
      const pageSize = Number(query.pageSize ?? 20);
      const offset = (page - 1) * pageSize;
      return { data: { items: rows }, pagination: { totalCount: total, limit: pageSize, offset, hasNext: offset + rows.length < total } };
    });
  }
}

// * Function [pageQuery]: Normalizes common page and page-size values for repository queries.
function pageQuery(input: Row) {
  return { page: Number(input.page ?? 1), pageSize: Number(input.pageSize ?? 20) };
}

// * Function [inventoryQuery]: Normalizes inventory filters and safe default sorting values.
function inventoryQuery(input: Row): any {
  return {
    ...input,
    ...pageQuery(input),
    expiryDays: Number(input.expiryDays ?? 90),
    sortBy: input.sortBy ?? 'productName',
    sortOrder: input.sortOrder === 'desc' ? 'desc' : 'asc',
  };
}

// * Function [availableQuantity]: Calculates stock that can be allocated after deductions.
function availableQuantity(balance: Row): number {
  return number(balance.onHandQty) - number(balance.reservedQty) - number(balance.damagedQty) - number(balance.quarantinedQty);
}

// * Function [number]: Converts a quantity input into a finite numeric value.
function number(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new InventoryValidationError('All quantity values must be valid numbers.');
  return parsed;
}

// * Function [positive]: Enforces positive quantity rules used by stock workflows.
function positive(value: unknown, field: string, allowZero = false): void {
  const parsed = number(value);
  if (allowZero ? parsed < 0 : parsed <= 0) throw new InventoryValidationError(`${field} must be ${allowZero ? 'zero or greater' : 'greater than zero'}.`);
}

// * Function [decimal]: Formats numeric quantities for PostgreSQL numeric columns.
function decimal(value: number): string {
  return value.toFixed(3).replace(/\.000$/, '').replace(/(\.\d*?)0+$/, '$1');
}

// * Function [patch]: Removes route-control fields before forwarding mutable values.
function patch(input: Row, excluded: string[]): Row {
  return Object.fromEntries(Object.entries(input).filter(([key, value]) => !excluded.includes(key) && value !== undefined));
}

// * Function [numberId]: Creates a human-readable application reference number.
function numberId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// * Function [requiredActor]: Enforces a UUID actor for auditable stock mutations.
function requiredActor(actor?: string): string {
  if (!actor || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(actor)) {
    throw new InventoryValidationError('A valid x-user-id UUID is required for this operation.');
  }
  return actor;
}
