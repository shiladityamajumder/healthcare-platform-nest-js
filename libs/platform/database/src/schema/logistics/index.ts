// * Linked with: ./carriers, ./carrier_accounts, ./serviceability_rules.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the logistics PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
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
