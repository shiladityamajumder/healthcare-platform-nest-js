// * Linked with: ./users, ./roles, ./permissions.
// * Used by: the package code that imports this component.
// * Other linkup: Column names and types must remain aligned with the PostgreSQL migration definitions.
/** Row shapes for the identity PostgreSQL schema. */
// * Describe the database row shape consumed by repositories and transaction code.
export type { IdentityUsersRow } from './users';
export type { IdentityRolesRow } from './roles';
export type { IdentityPermissionsRow } from './permissions';
export type { IdentityOtpChallengesRow } from './otp_challenges';
export type { IdentityApiClientsRow } from './api_clients';
export type { IdentityUserRolesRow } from './user_roles';
export type { IdentityRolePermissionsRow } from './role_permissions';
export type { IdentitySessionsRow } from './sessions';
export type { IdentityMfaFactorsRow } from './mfa_factors';
export type { IdentityTrustedDevicesRow } from './trusted_devices';
export type { IdentityLoginAttemptsRow } from './login_attempts';
export type { IdentityPasswordHistoryRow } from './password_history';
export type { IdentityApiClientSecretsRow } from './api_client_secrets';
export type { IdentityUserProfilesRow } from './user_profiles';
