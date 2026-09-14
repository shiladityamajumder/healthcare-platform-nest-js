// * Re-exports the typed PostgreSQL row shapes for the organization schema.
// * Used by repositories that need compile-time row types without ORM entities.
// ! These exports describe an existing database; they do not create or modify tables.
/** Row shapes for the organization PostgreSQL schema. */
export type { OrganizationOrganizationsRow } from './organizations';
export type { OrganizationLocationsRow } from './locations';
export type { OrganizationDepartmentsRow } from './departments';
export type { OrganizationBankAccountsRow } from './bank_accounts';
export type { OrganizationMembershipsRow } from './memberships';
export type { OrganizationLicensesRow } from './licenses';
