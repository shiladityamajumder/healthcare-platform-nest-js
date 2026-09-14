// * Re-exports the typed PostgreSQL row shapes for the logistics schema.
// * Used by repositories that need compile-time row types without ORM entities.
// ! These exports describe an existing database; they do not create or modify tables.
/** Row shapes for the logistics PostgreSQL schema. */
export type { LogisticsCarriersRow } from './carriers';
export type { LogisticsCarrierAccountsRow } from './carrier_accounts';
export type { LogisticsServiceabilityRulesRow } from './serviceability_rules';
export type { LogisticsDeliverySlotsRow } from './delivery_slots';
export type { LogisticsDeliveryRoutesRow } from './delivery_routes';
export type { LogisticsReverseShipmentsRow } from './reverse_shipments';
export type { LogisticsShipmentsRow } from './shipments';
export type { LogisticsShipmentEventsRow } from './shipment_events';
export type { LogisticsDeliveryAssignmentsRow } from './delivery_assignments';
export type { LogisticsDeliveryAttemptsRow } from './delivery_attempts';
export type { LogisticsNdrCasesRow } from './ndr_cases';
