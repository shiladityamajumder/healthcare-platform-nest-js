// * Re-exports the typed PostgreSQL row shapes for the risk schema.
// * Used by repositories that need compile-time row types without ORM entities.
// ! These exports describe an existing database; they do not create or modify tables.
/** Row shapes for the risk PostgreSQL schema. */
export type { RiskRulesRow } from './rules';
export type { RiskAssessmentsRow } from './assessments';
export type { RiskSignalsRow } from './signals';
export type { RiskCasesRow } from './cases';
export type { RiskBlocklistsRow } from './blocklists';
