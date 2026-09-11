// * Linked with: ./regulatory_authorities, ./legal_holds, ./privacy_requests.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the compliance PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
export type { ComplianceRegulatoryAuthoritiesRow } from './regulatory_authorities';
export type { ComplianceLegalHoldsRow } from './legal_holds';
export type { CompliancePrivacyRequestsRow } from './privacy_requests';
export type { ComplianceRegulatoryRegistrationsRow } from './regulatory_registrations';
export type { ComplianceEvidenceRow } from './evidence';
export type { ComplianceProductRecallsRow } from './product_recalls';
export type { ComplianceAdverseEventReportsRow } from './adverse_event_reports';
export type { ComplianceRecallLotsRow } from './recall_lots';
