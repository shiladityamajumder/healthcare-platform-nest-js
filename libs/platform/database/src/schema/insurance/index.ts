// Linked with: ./insurers, ./tpas, ./policies.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the insurance PostgreSQL schema. */
// Describe the database row shape consumed by repositories and transaction code.
export type { InsuranceInsurersRow } from './insurers';
export type { InsuranceTpasRow } from './tpas';
export type { InsurancePoliciesRow } from './policies';
export type { InsurancePolicyMembersRow } from './policy_members';
export type { InsuranceEligibilityChecksRow } from './eligibility_checks';
export type { InsuranceClaimsRow } from './claims';
export type { InsuranceClaimDocumentsRow } from './claim_documents';
export type { InsuranceClaimStatusHistoryRow } from './claim_status_history';
