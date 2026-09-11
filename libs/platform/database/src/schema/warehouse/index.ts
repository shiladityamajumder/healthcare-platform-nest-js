// * Linked with: ./warehouses, ./zones, ./inventory_adjustments.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the warehouse PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
export type { WarehouseWarehousesRow } from './warehouses';
export type { WarehouseZonesRow } from './zones';
export type { WarehouseInventoryAdjustmentsRow } from './inventory_adjustments';
export type { WarehouseStockTransfersRow } from './stock_transfers';
export type { WarehouseAislesRow } from './aisles';
export type { WarehouseRacksRow } from './racks';
export type { WarehouseReplenishmentRulesRow } from './replenishment_rules';
export type { WarehouseBinsRow } from './bins';
export type { WarehouseCycleCountsRow } from './cycle_counts';
export type { WarehouseInventoryLotsRow } from './inventory_lots';
export type { WarehouseStockBalancesRow } from './stock_balances';
export type { WarehouseStockLedgerRow } from './stock_ledger';
export type { WarehouseStockReservationsRow } from './stock_reservations';
export type { WarehouseStockHoldsRow } from './stock_holds';
export type { WarehouseInventoryAdjustmentItemsRow } from './inventory_adjustment_items';
export type { WarehouseStockTransferItemsRow } from './stock_transfer_items';
export type { WarehouseCycleCountItemsRow } from './cycle_count_items';
