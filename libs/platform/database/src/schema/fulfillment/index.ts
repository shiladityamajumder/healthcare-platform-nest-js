// * Linked with: ./picking_waves, ./fulfillment_orders, ./picking_wave_orders.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the fulfillment PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
export type { FulfillmentPickingWavesRow } from './picking_waves';
export type { FulfillmentFulfillmentOrdersRow } from './fulfillment_orders';
export type { FulfillmentPickingWaveOrdersRow } from './picking_wave_orders';
export type { FulfillmentPickTasksRow } from './pick_tasks';
export type { FulfillmentPackTasksRow } from './pack_tasks';
export type { FulfillmentFulfillmentEventsRow } from './fulfillment_events';
export type { FulfillmentPackagesRow } from './packages';
export type { FulfillmentFulfillmentOrderItemsRow } from './fulfillment_order_items';
export type { FulfillmentPickTaskItemsRow } from './pick_task_items';
export type { FulfillmentPackageItemsRow } from './package_items';
