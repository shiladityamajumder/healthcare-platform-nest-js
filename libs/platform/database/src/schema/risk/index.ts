// Linked with: ./rules, ./assessments, ./signals.
// Used by: the package code that imports this component.
// Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the risk PostgreSQL schema. */
// Describe the database row shape consumed by repositories and transaction code.
export type { RiskRulesRow } from './rules';
export type { RiskAssessmentsRow } from './assessments';
export type { RiskSignalsRow } from './signals';
export type { RiskCasesRow } from './cases';
export type { RiskBlocklistsRow } from './blocklists';
