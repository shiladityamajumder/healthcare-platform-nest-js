// * Auth module: Defines token, identity, session, OTP, and authorization port contracts.
// * File: src/contracts/auth.ports.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Type and DI contracts between auth application workflows and adapters.
 * Used backward by workflow/features; connects forward to PostgreSQL repositories and token services.
 */
import type { QueryResultRow } from 'pg';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');
export const AUTH_TOKEN_SERVICE = Symbol('AUTH_TOKEN_SERVICE');

// * Contract [AuthUser]: Defines the stable shape shared across auth layers.
export interface AuthUser {
  id: string;
  email: string | null;
  emailVerified: boolean;
  phoneCountryCode: string | null;
  phoneNumberMasked: string | null;
  phoneVerified: boolean;
  status: string;
  preferredLocale: string;
  timezone: string;
  displayName: string;
  profile: {
    firstName: string | null;
    lastName: string | null;
    preferredName: string | null;
    avatar: { id: string; url: string } | null;
  } | null;
}

// * Contract [AuthPrincipal]: Defines the stable shape shared across auth layers.
export interface AuthPrincipal {
  userId: string;
  sessionId: string;
  roles: string[];
  permissions: string[];
}

// * Contract [AuthLoginUser]: Defines the stable shape shared across auth layers.
export interface AuthLoginUser extends AuthUser {
  passwordHash: string | null;
  lockedUntil: Date | null;
  failedLoginCount: number;
}

// * Contract [AuthSession]: Defines the stable shape shared across auth layers.
export interface AuthSession {
  id: string;
  userId: string;
  familyId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  deviceId: string | null;
}

// * Contract [TokenClaims]: Defines the stable shape shared across auth layers.
export interface TokenClaims {
  sub: string;
  token_type: 'access' | 'refresh' | 'password_reset';
  jti: string;
  sid?: string;
  fam?: string;
  challenge_id?: string;
  channel?: string;
  destination_hash?: string;
  iat: number;
  exp: number;
  iss?: string;
  aud?: string;
}

// * Contract [TokenServicePort]: Defines the stable shape shared across auth layers.
export interface TokenServicePort {
  createAccess(userId: string, sessionId: string, methods: string[]): EncodedToken;
  createRefresh(userId: string, sessionId: string, familyId: string): EncodedToken;
  createReset(
    userId: string,
    challengeId: string,
    channel: string,
    destinationHash: string,
  ): EncodedToken;
  decode(token: string, expected: TokenClaims['token_type']): TokenClaims;
  hash(value: string, namespace: string): string;
  otpHash(challengeId: string, code: string): string;
  jwks(): Array<Record<string, string>>;
}

// * Contract [EncodedToken]: Defines the stable shape shared across auth layers.
export interface EncodedToken {
  token: string;
  expiresAt: Date;
  jti: string;
}

// * Contract [UserWriteInput]: Defines the stable shape shared across auth layers.
export interface UserWriteInput {
  email?: string | null;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
  passwordHash?: string | null;
  status: string;
  preferredLocale: string;
  timezone: string;
  termsVersion?: string | null;
  privacyVersion?: string | null;
  actorUserId?: string | null;
}

// * Contract [ProfileInput]: Defines the stable shape shared across auth layers.
export interface ProfileInput {
  firstName?: string | null;
  lastName?: string | null;
  preferredName?: string | null;
  avatarFileId?: string | null;
}

// * Contract [OtpRecord]: Defines the stable shape shared across auth layers.
export interface OtpRecord {
  id: string;
  channel: string;
  destinationHash: string;
  purpose: string;
  otpHash: string;
  attempts: number;
  maxAttempts: number;
  expiresAt: Date;
  consumedAt: Date | null;
  blockedAt: Date | null;
}

// * Contract [AuthRepositoryPort]: Defines the stable shape shared across auth layers.
export interface AuthRepositoryPort {
  findUserById(id: string): Promise<AuthUser | null>;
  findPrincipal(sessionId: string, userId: string): Promise<AuthPrincipal | null>;
  findUserForLogin(identity: {
    email?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
  }): Promise<AuthLoginUser | null>;
  findUserByEmail(email: string): Promise<AuthUser | null>;
  findUserByPhone(countryCode: string, phoneNumber: string): Promise<AuthUser | null>;
  createUser(input: UserWriteInput): Promise<AuthUser>;
  updateUser(id: string, values: Record<string, unknown>): Promise<AuthUser>;
  createProfile(userId: string, input: ProfileInput): Promise<void>;
  findRoleByCode(code: string): Promise<{ id: string } | null>;
  assignRole(userId: string, roleId: string, actorUserId?: string): Promise<void>;
  createOtp(input: {
    id: string;
    channel: string;
    destinationHash: string;
    purpose: string;
    otpHash: string;
    expiresAt: Date;
    maxAttempts: number;
  }): Promise<{ id: string; expiresAt: Date }>;
  findOtp(id: string): Promise<OtpRecord | null>;
  consumeOtp(id: string, attempts: number, consumed: boolean, blocked: boolean): Promise<void>;
  createSession(input: {
    id: string;
    userId: string;
    refreshTokenHash: string;
    familyId: string;
    deviceId?: string;
    deviceType?: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }): Promise<void>;
  findSession(id: string): Promise<AuthSession | null>;
  rotateSession(id: string, refreshTokenHash: string, expiresAt: Date): Promise<void>;
  revokeSession(id: string, reason: string): Promise<void>;
  revokeOtherSessions(userId: string, currentSessionId: string): Promise<void>;
  revokeAllSessions(userId: string, reason: string): Promise<void>;
  listSessions(userId: string): Promise<Array<Record<string, unknown>>>;
  authorization(userId: string): Promise<{ roles: string[]; permissions: string[] }>;
  listUsers(
    limit: number,
    offset: number,
    search?: string,
    status?: string,
  ): Promise<{ rows: AuthUser[]; total: number }>;
  listRoles(): Promise<Array<Record<string, unknown>>>;
  findRole(id: string): Promise<Record<string, unknown> | null>;
  createRole(input: {
    code: string;
    name: string;
    description?: string | null;
    actorUserId: string;
  }): Promise<Record<string, unknown>>;
  updateRole(
    id: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>>;
  deleteRole(id: string, actorUserId: string): Promise<void>;
  listPermissions(): Promise<Array<Record<string, unknown>>>;
  findPermission(id: string): Promise<Record<string, unknown> | null>;
  createPermission(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  updatePermission(
    id: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>>;
  deletePermission(id: string, actorUserId: string): Promise<void>;
  rolePermissions(roleId: string): Promise<Array<Record<string, unknown>>>;
  replaceRolePermissions(
    roleId: string,
    permissionIds: string[],
    actorUserId: string,
  ): Promise<Array<Record<string, unknown>>>;
  userRoles(userId: string): Promise<Array<Record<string, unknown>>>;
  assignUserRole(
    userId: string,
    input: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>>;
  updateUserRole(
    userId: string,
    assignmentId: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>>;
  deleteUserRole(userId: string, assignmentId: string, actorUserId: string): Promise<void>;
}

// * Contract [RawRow]: Defines a shared authentication type alias.
export type RawRow = QueryResultRow & Record<string, unknown>;
