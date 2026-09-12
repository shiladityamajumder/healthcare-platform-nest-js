/**
 * PostgreSQL adapter for users, profiles, roles, and authorization lookup.
 * Used backward by registration/login/current-user/administration services; connects forward to PostgresDatabase.
 * Database queries reuse the transaction client opened by HTTP execution.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { PostgresDatabase } from '@platform/database';
import { DatabaseError, NotFoundError } from '@shared/errors';
import type {
  AuthLoginUser,
  AuthUser,
  UserWriteInput,
  ProfileInput,
} from '../../contracts/auth.ports';

export const AUTH_USER_SELECT = `
  SELECT u.id, u.email, u.email_verified_at, u.phone_country_code, u.phone_number,
         u.phone_verified_at, u.status, u.preferred_locale, u.timezone,
         p.first_name, p.last_name, p.preferred_name, p.avatar_file_id,
         f.public_url AS avatar_url
  FROM identity.users u
  LEFT JOIN identity.user_profiles p ON p.user_id = u.id AND p.is_deleted = false
  LEFT JOIN platform.file_objects f ON f.id = p.avatar_file_id
    AND f.status = 'available' AND f.access_type = 'public' AND f.malware_scan_status = 'clean'`;

type Row = Record<string, any>;

@Injectable()
export class IdentityRepository {
  public constructor(private readonly database: PostgresDatabase) {}

  public async findUserById(id: string): Promise<AuthUser | null> {
    const result = await this.database.query<Row>(`${AUTH_USER_SELECT} WHERE u.id = $1`, [id]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  public async findUserByEmail(email: string): Promise<AuthUser | null> {
    const result = await this.database.query<Row>(
      `${AUTH_USER_SELECT} WHERE u.email_normalized = $1`,
      [email],
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  public async findUserByPhone(countryCode: string, phoneNumber: string): Promise<AuthUser | null> {
    const result = await this.database.query<Row>(
      `${AUTH_USER_SELECT} WHERE u.phone_country_code = $1 AND u.phone_number = $2`,
      [countryCode, phoneNumber],
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  public async findUserForLogin(identity: {
    email?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
  }): Promise<AuthLoginUser | null> {
    // Select credential state only for login; normal user responses never expose these columns.
    const predicate = identity.email
      ? 'u.email_normalized = $1'
      : 'u.phone_country_code = $1 AND u.phone_number = $2';
    const values = identity.email
      ? [identity.email]
      : [identity.phoneCountryCode, identity.phoneNumber];
    const result = await this.database.query<Row>(
      `${AUTH_USER_SELECT.replace('SELECT ', 'SELECT u.password_hash, u.locked_until, u.failed_login_count, ')} WHERE ${predicate}`,
      values,
    );
    if (!result.rows[0]) return null;
    return {
      ...mapUser(result.rows[0]),
      passwordHash: result.rows[0].password_hash,
      lockedUntil: result.rows[0].locked_until,
      failedLoginCount: result.rows[0].failed_login_count,
    };
  }

  public async createUser(input: UserWriteInput): Promise<AuthUser> {
    const result = await this.database.query<Row>(
      `INSERT INTO identity.users
        (email, email_normalized, phone_country_code, phone_number, password_hash, status,
         preferred_locale, timezone, terms_version, privacy_version, created_by, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11) RETURNING id`,
      [
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
      ],
    );
    const user = await this.findUserById(result.rows[0].id);
    if (!user) throw new DatabaseError('The created identity could not be loaded.');
    return user;
  }

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
    const assignments = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const result = await this.database.query<Row>(
      `UPDATE identity.users SET ${assignments}, updated_at = now(), row_version = row_version + 1 WHERE id = $${entries.length + 1} RETURNING id`,
      [...entries.map(([, value]) => value), id],
    );
    if (!result.rows[0]) throw new NotFoundError('The user was not found.');
    const user = await this.findUserById(id);
    if (!user) throw new NotFoundError('The user was not found.');
    return user;
  }

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
    const updated = await this.database.query(
      `UPDATE identity.user_profiles SET ${entries
        .map(([field], index) => `${field} = $${index + 2}`)
        .join(
          ', ',
        )}, updated_at = now(), row_version = row_version + 1 WHERE user_id = $1 AND is_deleted = false`,
      [userId, ...entries.map(([, value]) => value)],
    );
    if (!updated.rowCount && entries.some(([, value]) => value !== null))
      await this.database.query(
        `INSERT INTO identity.user_profiles (user_id, first_name, last_name, preferred_name, avatar_file_id) VALUES ($1,$2,$3,$4,$5)`,
        [
          userId,
          input.firstName ?? null,
          input.lastName ?? null,
          input.preferredName ?? null,
          input.avatarFileId ?? null,
        ],
      );
  }

  public async findRoleByCode(code: string): Promise<{ id: string } | null> {
    const result = await this.database.query<Row>(
      `SELECT id FROM identity.roles WHERE code = $1 AND is_deleted = false`,
      [code],
    );
    return result.rows[0] ? { id: result.rows[0].id } : null;
  }

  public async assignRole(userId: string, roleId: string, actorUserId?: string): Promise<void> {
    await this.database.query(
      `INSERT INTO identity.user_roles (user_id, role_id, created_by, updated_by) VALUES ($1,$2,$3,$3) ON CONFLICT (user_id, role_id, scope_type, scope_id) DO UPDATE SET is_active = true, updated_at = now(), row_version = identity.user_roles.row_version + 1`,
      [userId, roleId, actorUserId ?? null],
    );
  }

  public async authorization(userId: string): Promise<{ roles: string[]; permissions: string[] }> {
    const result = await this.database.query<Row>(
      `SELECT DISTINCT r.code AS role_code, p.code AS permission_code FROM identity.user_roles ur JOIN identity.roles r ON r.id = ur.role_id AND r.is_deleted = false LEFT JOIN identity.role_permissions rp ON rp.role_id = r.id LEFT JOIN identity.permissions p ON p.id = rp.permission_id AND p.is_deleted = false WHERE ur.user_id = $1 AND ur.is_active = true AND (ur.valid_from IS NULL OR ur.valid_from <= now()) AND (ur.valid_until IS NULL OR ur.valid_until > now())`,
      [userId],
    );
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

  public async listUsers(
    limit: number,
    offset: number,
    search?: string,
    status?: string,
  ): Promise<{ rows: AuthUser[]; total: number }> {
    // Build predicates separately while keeping every user-provided value parameterized.
    const where: string[] = [];
    const values: unknown[] = [];
    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      where.push(
        `(u.email_normalized LIKE $${values.length} OR u.phone_number LIKE $${values.length})`,
      );
    }
    if (status) {
      values.push(status);
      where.push(`u.status = $${values.length}`);
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const count = await this.database.query<Row>(
      `SELECT count(*)::int AS total FROM identity.users u ${clause}`,
      values,
    );
    const limitIndex = values.length + 1;
    const offsetIndex = values.length + 2;
    values.push(limit, offset);
    const result = await this.database.query<Row>(
      `${AUTH_USER_SELECT} ${clause} ORDER BY u.created_at DESC LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
      values,
    );
    return { rows: result.rows.map(mapUser), total: count.rows[0].total };
  }
}

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
