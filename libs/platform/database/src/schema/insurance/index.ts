// * Re-exports the typed PostgreSQL row shapes for the insurance schema.
// * Used by repositories that need compile-time row types without ORM entities.
// ! These exports describe an existing database; they do not create or modify tables.
/** Row shapes for the insurance PostgreSQL schema. */
export type { InsuranceInsurersRow } from './insurers';
export type { InsuranceTpasRow } from './tpas';
export type { InsurancePoliciesRow } from './policies';
export type { InsurancePolicyMembersRow } from './policy_members';
export type { InsuranceEligibilityChecksRow } from './eligibility_checks';
export type { InsuranceClaimsRow } from './claims';
export type { InsuranceClaimDocumentsRow } from './claim_documents';
export type { InsuranceClaimStatusHistoryRow } from './claim_status_history';
