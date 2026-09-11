// * Linked with: ./organizations, ./locations, ./departments.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the organization PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
export type { OrganizationOrganizationsRow } from './organizations';
export type { OrganizationLocationsRow } from './locations';
export type { OrganizationDepartmentsRow } from './departments';
export type { OrganizationBankAccountsRow } from './bank_accounts';
export type { OrganizationMembershipsRow } from './memberships';
export type { OrganizationLicensesRow } from './licenses';
