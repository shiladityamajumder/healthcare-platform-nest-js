// * Auth module: Persists identities, profiles, OTP challenges, and role assignments.
// * File: src/features/registration/identity.repository.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * PostgreSQL adapter for users, profiles, roles, and authorization lookup.
 * Used backward by registration/login/current-user/administration services; connects forward to PostgresDatabase.
 * Database queries reuse the transaction client opened by HTTP execution.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PostgresDatabase } from '@platform/database';
import { DatabaseError, NotFoundError } from '@shared/errors';
import { loadAuthSql } from '../../infrastructure/persistence/sql-loader';
import type {
  AuthLoginUser,
  AuthPrincipal,
  AuthUser,
  UserWriteInput,
  ProfileInput,
} from '../../contracts/auth.ports';

type Row = Record<string, any>;

@Injectable()
export class IdentityRepository {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(private readonly database: PostgresDatabase) {}

  // * Function [findUserById]: Handles the findUserById operation for this authentication component.
  public async findUserById(id: string): Promise<AuthUser | null> {
    const result = await this.database.query<Row>(loadAuthSql('identity.find-user-by-id'), [id]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  // * Function [findUserByEmail]: Handles the findUserByEmail operation for this authentication component.
  public async findUserByEmail(email: string): Promise<AuthUser | null> {
    const result = await this.database.query<Row>(loadAuthSql('identity.find-user-by-email'), [
      email,
    ]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  // * Function [findUserByPhone]: Handles the findUserByPhone operation for this authentication component.
  public async findUserByPhone(countryCode: string, phoneNumber: string): Promise<AuthUser | null> {
    const result = await this.database.query<Row>(loadAuthSql('identity.find-user-by-phone'), [
      countryCode,
      phoneNumber,
    ]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  // * Function [findUserForLogin]: Handles the findUserForLogin operation for this authentication component.
  public async findUserForLogin(identity: {
    email?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
  }): Promise<AuthLoginUser | null> {
    // Select credential state only for login; normal user responses never expose these columns.
    const statement = identity.email
      ? loadAuthSql('identity.find-user-for-login-email')
      : loadAuthSql('identity.find-user-for-login-phone');
    const values = identity.email
      ? [identity.email]
      : [identity.phoneCountryCode, identity.phoneNumber];
    const result = await this.database.query<Row>(statement, values);
    if (!result.rows[0]) return null;
    return {
      ...mapUser(result.rows[0]),
      passwordHash: result.rows[0].password_hash,
      lockedUntil: result.rows[0].locked_until,
      failedLoginCount: result.rows[0].failed_login_count,
    };
  }

  // * Function [createUser]: Creates or issues the requested authentication resource.
  public async createUser(input: UserWriteInput): Promise<AuthUser> {
    const result = await this.database.query<Row>(loadAuthSql('identity.create-user'), [
      input.email ?? null,
      input.email?.toLowerCase() ?? null,
      input.phoneCountryCode ?? null,
      input.phoneNumber ?? null,
      input.passwordHash ?? null,
      input.status,
      input.preferredLocale,
      input.timezone,
      input.termsVersion ?? null,
      input.privacyVersion ?? null,
      input.actorUserId ?? null,
    ]);
    if (!result.rows[0]) throw new DatabaseError('The created identity could not be loaded.');
    return mapUser(result.rows[0]);
  }

  // * Function [updateUser]: Handles the updateUser operation for this authentication component.
  public async updateUser(id: string, values: Record<string, unknown>): Promise<AuthUser> {
    // Whitelist column names because values are parameterized but SQL identifiers are interpolated.
    const allowed = [
      'status',
      'preferred_locale',
      'timezone',
      'email_verified_at',
      'phone_verified_at',
      'password_hash',
      'last_login_at',
      'failed_login_count',
      'locked_until',
      'account_closed_at',
    ];
    const entries = Object.entries(values).filter(([key]) => allowed.includes(key));
    if (entries.length === 0) return this.findUserById(id) as Promise<AuthUser>;
    const result = await this.database.query<Row>(loadAuthSql('identity.update-user'), [
      id,
      JSON.stringify(Object.fromEntries(entries)),
    ]);
    if (!result.rows[0]) throw new NotFoundError('The user was not found.');
    return mapUser(result.rows[0]);
  }

  // * Function [createProfile]: Creates or issues the requested authentication resource.
  public async createProfile(userId: string, input: ProfileInput): Promise<void> {
    // Undefined means "leave unchanged"; null intentionally clears a profile field.
    const fields: Record<string, unknown> = {
      first_name: input.firstName,
      last_name: input.lastName,
      preferred_name: input.preferredName,
      avatar_file_id: input.avatarFileId,
    };
    const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
    if (!entries.length) return;
    await this.database.query(loadAuthSql('identity.upsert-profile'), [
      userId,
      JSON.stringify(input),
    ]);
  }

  // * Function [findRoleByCode]: Handles the findRoleByCode operation for this authentication component.
  public async findRoleByCode(code: string): Promise<{ id: string } | null> {
    const result = await this.database.query<Row>(loadAuthSql('identity.find-role-by-code'), [
      code,
    ]);
    return result.rows[0] ? { id: result.rows[0].id } : null;
  }

  // * Function [assignRole]: Creates or issues the requested authentication resource.
  public async assignRole(userId: string, roleId: string, actorUserId?: string): Promise<void> {
    await this.database.query(loadAuthSql('identity.assign-role'), [
      userId,
      roleId,
      actorUserId ?? null,
    ]);
  }

  // * Function [authorization]: Retrieves and returns the requested authentication data.
  public async authorization(userId: string): Promise<{ roles: string[]; permissions: string[] }> {
    const result = await this.database.query<Row>(loadAuthSql('identity.authorization'), [userId]);
    return {
      roles: [
        ...new Set(
          result.rows.flatMap((row) => (row.role_code == null ? [] : [String(row.role_code)])),
        ),
      ],
      permissions: [
        ...new Set(
          result.rows.flatMap((row) =>
            row.permission_code == null ? [] : [String(row.permission_code)],
          ),
        ),
      ],
    };
  }

  // * Function [findPrincipal]: Loads the active session, user, roles, and permissions in one query.
  public async findPrincipal(sessionId: string, userId: string): Promise<AuthPrincipal | null> {
    const result = await this.database.query<Row>(loadAuthSql('identity.find-principal'), [
      sessionId,
      userId,
    ]);
    const row = result.rows[0];
    return row
      ? {
          userId: row.user_id,
          sessionId: row.session_id,
          roles: (row.roles as string[]) ?? [],
          permissions: (row.permissions as string[]) ?? [],
        }
      : null;
  }

  // * Function [listUsers]: Handles the listUsers operation for this authentication component.
  public async listUsers(
    limit: number,
    offset: number,
    search?: string,
    status?: string,
  ): Promise<{ rows: AuthUser[]; total: number }> {
    // Build predicates separately while keeping every user-provided value parameterized.
    const result = await this.database.query<Row>(loadAuthSql('identity.list-users'), [
      search ? `%${search.toLowerCase()}%` : null,
      status ?? null,
      limit,
      offset,
    ]);
    return { rows: result.rows.map(mapUser), total: Number(result.rows[0]?.total_count ?? 0) };
  }
}

// * Function [mapUser]: Transforms the supplied value into the format required by this authentication flow.
export function mapUser(row: Row): AuthUser {
  const firstName = row.first_name ?? null;
  const lastName = row.last_name ?? null;
  const preferredName = row.preferred_name ?? null;
  return {
    id: row.id,
    email: row.email,
    emailVerified: Boolean(row.email_verified_at),
    phoneCountryCode: row.phone_country_code,
    phoneNumberMasked: row.phone_number ? `******${String(row.phone_number).slice(-4)}` : null,
    phoneVerified: Boolean(row.phone_verified_at),
    status: row.status,
    preferredLocale: row.preferred_locale,
    timezone: row.timezone,
    displayName:
      preferredName || [firstName, lastName].filter(Boolean).join(' ') || row.email || 'User',
    profile:
      firstName || lastName || preferredName || row.avatar_file_id
        ? {
            firstName,
            lastName,
            preferredName,
            avatar:
              row.avatar_file_id && row.avatar_url
                ? { id: row.avatar_file_id, url: row.avatar_url }
                : null,
          }
        : null,
  };
}
