// * Linked with: ./test_definitions, ./test_packages, ./lab_providers.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the diagnostics PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
export type { DiagnosticsTestDefinitionsRow } from './test_definitions';
export type { DiagnosticsTestPackagesRow } from './test_packages';
export type { DiagnosticsLabProvidersRow } from './lab_providers';
export type { DiagnosticsTestPackageItemsRow } from './test_package_items';
export type { DiagnosticsLabLocationsRow } from './lab_locations';
export type { DiagnosticsLabOfferingsRow } from './lab_offerings';
export type { DiagnosticsDiagnosticOrdersRow } from './diagnostic_orders';
export type { DiagnosticsDiagnosticOrderItemsRow } from './diagnostic_order_items';
export type { DiagnosticsSampleCollectionsRow } from './sample_collections';
export type { DiagnosticsDiagnosticReportsRow } from './diagnostic_reports';
export type { DiagnosticsSamplesRow } from './samples';
export type { DiagnosticsDiagnosticResultValuesRow } from './diagnostic_result_values';
export type { DiagnosticsSampleEventsRow } from './sample_events';
