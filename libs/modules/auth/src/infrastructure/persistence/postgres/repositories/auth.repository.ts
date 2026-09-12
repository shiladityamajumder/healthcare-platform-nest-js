/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { PostgresDatabase } from '@platform/database';
import { DatabaseError, NotFoundError } from '@shared/errors';
import type {
  AuthRepositoryPort,
  AuthUser,
  OtpRecord,
  ProfileInput,
  UserWriteInput,
} from '../../../../domain/ports/auth.ports';
import { AUTH_USER_SELECT } from '../queries/auth.queries';

type Row = Record<string, any>;

@Injectable()
export class AuthPostgresRepository implements AuthRepositoryPort {
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
  }): Promise<any> {
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
    try {
      const result = await this.database.query<Row>(
        `INSERT INTO identity.users
          (email, email_normalized, phone_country_code, phone_number, password_hash, status,
           preferred_locale, timezone, terms_version, privacy_version, created_by, updated_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11)
         RETURNING id`,
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
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw error;
      throw error;
    }
  }

  public async updateUser(id: string, values: Record<string, unknown>): Promise<AuthUser> {
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
    const updated = await this.database.query(
      `UPDATE identity.user_profiles SET first_name = COALESCE($2, first_name), last_name = COALESCE($3, last_name), preferred_name = COALESCE($4, preferred_name), avatar_file_id = COALESCE($5, avatar_file_id), updated_at = now(), row_version = row_version + 1 WHERE user_id = $1 AND is_deleted = false`,
      [
        userId,
        input.firstName ?? null,
        input.lastName ?? null,
        input.preferredName ?? null,
        input.avatarFileId ?? null,
      ],
    );
    if (!updated.rowCount)
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

  public async createOtp(input: {
    id: string;
    channel: string;
    destinationHash: string;
    purpose: string;
    otpHash: string;
    expiresAt: Date;
    maxAttempts: number;
  }): Promise<{ id: string; expiresAt: Date }> {
    const result = await this.database.query<Row>(
      `INSERT INTO identity.otp_challenges (id, channel, destination_hash, purpose, otp_hash, expires_at, max_attempts) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, expires_at`,
      [
        input.id,
        input.channel,
        input.destinationHash,
        input.purpose,
        input.otpHash,
        input.expiresAt,
        input.maxAttempts,
      ],
    );
    return { id: result.rows[0].id, expiresAt: result.rows[0].expires_at };
  }

  public async findOtp(id: string): Promise<OtpRecord | null> {
    const result = await this.database.query<Row>(
      `SELECT id, channel, destination_hash, purpose, otp_hash, attempts, max_attempts, expires_at, consumed_at, blocked_at FROM identity.otp_challenges WHERE id = $1 FOR UPDATE`,
      [id],
    );
    const row = result.rows[0];
    return row
      ? {
          id: row.id,
          channel: row.channel,
          destinationHash: row.destination_hash,
          purpose: row.purpose,
          otpHash: row.otp_hash,
          attempts: row.attempts,
          maxAttempts: row.max_attempts,
          expiresAt: row.expires_at,
          consumedAt: row.consumed_at,
          blockedAt: row.blocked_at,
        }
      : null;
  }

  public async consumeOtp(
    id: string,
    attempts: number,
    consumed: boolean,
    blocked: boolean,
  ): Promise<void> {
    await this.database.query(
      `UPDATE identity.otp_challenges SET attempts = $2, consumed_at = CASE WHEN $3 THEN now() ELSE consumed_at END, blocked_at = CASE WHEN $4 THEN now() ELSE blocked_at END, updated_at = now(), row_version = row_version + 1 WHERE id = $1`,
      [id, attempts, consumed, blocked],
    );
  }

  public async createSession(input: {
    id: string;
    userId: string;
    refreshTokenHash: string;
    familyId: string;
    deviceId?: string;
    deviceType?: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.database.query(
      `INSERT INTO identity.sessions (id, user_id, refresh_token_hash, token_family_id, device_id, device_type, ip_address, user_agent, expires_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        input.id,
        input.userId,
        input.refreshTokenHash,
        input.familyId,
        input.deviceId ?? null,
        input.deviceType ?? null,
        input.ipAddress ?? null,
        input.userAgent ?? null,
        input.expiresAt,
      ],
    );
  }

  public async findSession(id: string): Promise<any> {
    const result = await this.database.query<Row>(
      `SELECT id, user_id, token_family_id, refresh_token_hash, expires_at, revoked_at, device_id FROM identity.sessions WHERE id = $1`,
      [id],
    );
    const row = result.rows[0];
    return row
      ? {
          id: row.id,
          userId: row.user_id,
          familyId: row.token_family_id,
          refreshTokenHash: row.refresh_token_hash,
          expiresAt: row.expires_at,
          revokedAt: row.revoked_at,
          deviceId: row.device_id,
        }
      : null;
  }

  public async rotateSession(id: string, refreshTokenHash: string, expiresAt: Date): Promise<void> {
    await this.database.query(
      `UPDATE identity.sessions SET refresh_token_hash = $2, expires_at = $3, last_seen_at = now(), updated_at = now(), row_version = row_version + 1 WHERE id = $1 AND revoked_at IS NULL`,
      [id, refreshTokenHash, expiresAt],
    );
  }

  public async revokeSession(id: string, reason: string): Promise<void> {
    await this.database.query(
      `UPDATE identity.sessions SET revoked_at = COALESCE(revoked_at, now()), revoke_reason = $2, updated_at = now(), row_version = row_version + 1 WHERE id = $1`,
      [id, reason],
    );
  }
  public async revokeOtherSessions(userId: string, currentSessionId: string): Promise<void> {
    await this.database.query(
      `UPDATE identity.sessions SET revoked_at = now(), revoke_reason = 'logout_others', updated_at = now(), row_version = row_version + 1 WHERE user_id = $1 AND id <> $2 AND revoked_at IS NULL`,
      [userId, currentSessionId],
    );
  }
  public async revokeAllSessions(userId: string, reason: string): Promise<void> {
    await this.database.query(
      `UPDATE identity.sessions SET revoked_at = now(), revoke_reason = $2, updated_at = now(), row_version = row_version + 1 WHERE user_id = $1 AND revoked_at IS NULL`,
      [userId, reason],
    );
  }

  public async listSessions(userId: string): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(
      `SELECT id, device_id, device_type, host(ip_address) AS ip_address, user_agent, created_at, last_seen_at, expires_at FROM identity.sessions WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > now() ORDER BY last_seen_at DESC NULLS LAST, created_at DESC`,
      [userId],
    );
    return result.rows.map((row) => ({
      id: row.id,
      deviceId: row.device_id,
      deviceType: row.device_type,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: row.created_at,
      lastSeenAt: row.last_seen_at,
      expiresAt: row.expires_at,
    }));
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

  public async listRoles(): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(
      `SELECT id, code, name, description, is_system, created_at, updated_at FROM identity.roles WHERE is_deleted = false ORDER BY code`,
    );
    return result.rows.map(mapRole);
  }
  public async findRole(id: string): Promise<Record<string, unknown> | null> {
    const result = await this.database.query<Row>(
      `SELECT id, code, name, description, is_system, created_at, updated_at FROM identity.roles WHERE id = $1 AND is_deleted = false`,
      [id],
    );
    return result.rows[0] ? mapRole(result.rows[0]) : null;
  }
  public async createRole(input: {
    code: string;
    name: string;
    description?: string | null;
    actorUserId: string;
  }): Promise<Record<string, unknown>> {
    const result = await this.database.query<Row>(
      `INSERT INTO identity.roles (code,name,description,created_by,updated_by) VALUES ($1,$2,$3,$4,$4) RETURNING id,code,name,description,is_system,created_at,updated_at`,
      [input.code, input.name, input.description ?? null, input.actorUserId],
    );
    return mapRole(result.rows[0]);
  }
  public async updateRole(
    id: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    return this.updateMaster('roles', id, values, actorUserId, true);
  }
  public async deleteRole(id: string, actorUserId: string): Promise<void> {
    const result = await this.database.query(
      `UPDATE identity.roles SET is_deleted = true, deleted_at = now(), deleted_by = $2, updated_at = now(), row_version = row_version + 1 WHERE id = $1 AND is_system = false AND is_deleted = false`,
      [id, actorUserId],
    );
    if (!result.rowCount) throw new NotFoundError('The role was not found or is protected.');
  }
  public async listPermissions(): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(
      `SELECT id,code,resource,action,description,created_at,updated_at FROM identity.permissions WHERE is_deleted = false ORDER BY code`,
    );
    return result.rows.map(mapPermission);
  }
  public async findPermission(id: string): Promise<Record<string, unknown> | null> {
    const result = await this.database.query<Row>(
      `SELECT id,code,resource,action,description,created_at,updated_at FROM identity.permissions WHERE id = $1 AND is_deleted = false`,
      [id],
    );
    return result.rows[0] ? mapPermission(result.rows[0]) : null;
  }
  public async createPermission(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const result = await this.database.query<Row>(
      `INSERT INTO identity.permissions (code,resource,action,description,created_by,updated_by) VALUES ($1,$2,$3,$4,$5,$5) RETURNING id,code,resource,action,description,created_at,updated_at`,
      [input.code, input.resource, input.action, input.description ?? null, input.actorUserId],
    );
    return mapPermission(result.rows[0]);
  }
  public async updatePermission(
    id: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    return this.updateMaster('permissions', id, values, actorUserId, false);
  }
  public async deletePermission(id: string, actorUserId: string): Promise<void> {
    const result = await this.database.query(
      `UPDATE identity.permissions SET is_deleted = true, deleted_at = now(), deleted_by = $2, updated_at = now(), row_version = row_version + 1 WHERE id = $1 AND is_deleted = false`,
      [id, actorUserId],
    );
    if (!result.rowCount) throw new NotFoundError('The permission was not found.');
  }
  public async rolePermissions(roleId: string): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(
      `SELECT p.id,p.code,p.resource,p.action,p.description,p.created_at,p.updated_at FROM identity.role_permissions rp JOIN identity.permissions p ON p.id = rp.permission_id AND p.is_deleted = false WHERE rp.role_id = $1 ORDER BY p.code`,
      [roleId],
    );
    return result.rows.map(mapPermission);
  }
  public async replaceRolePermissions(
    roleId: string,
    permissionIds: string[],
    actorUserId: string,
  ): Promise<Array<Record<string, unknown>>> {
    await this.database.query(`DELETE FROM identity.role_permissions WHERE role_id = $1`, [roleId]);
    if (permissionIds.length)
      await this.database.query(
        `INSERT INTO identity.role_permissions (role_id, permission_id, created_by, updated_by) SELECT $1, p.id, $3, $3 FROM identity.permissions p WHERE p.id = ANY($2::uuid[]) AND p.is_deleted = false`,
        [roleId, permissionIds, actorUserId],
      );
    return this.rolePermissions(roleId);
  }
  public async userRoles(userId: string): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(
      `SELECT ur.id,ur.user_id,ur.role_id,r.code AS role_code,r.name AS role_name,ur.scope_type,ur.scope_id,ur.valid_from,ur.valid_until,ur.is_active,ur.created_at,ur.updated_at FROM identity.user_roles ur JOIN identity.roles r ON r.id = ur.role_id WHERE ur.user_id = $1 ORDER BY r.code`,
      [userId],
    );
    return result.rows.map(mapUserRole);
  }
  public async assignUserRole(
    userId: string,
    input: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    const result = await this.database.query<Row>(
      `INSERT INTO identity.user_roles (user_id,role_id,scope_type,scope_id,valid_from,valid_until,is_active,created_by,updated_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8) RETURNING id`,
      [
        userId,
        input.roleId,
        input.scopeType ?? null,
        input.scopeId ?? null,
        input.validFrom ?? null,
        input.validUntil ?? null,
        input.isActive ?? true,
        actorUserId,
      ],
    );
    const rows = await this.userRoles(userId);
    const found = rows.find((row) => row.id === result.rows[0].id);
    if (!found) throw new DatabaseError('The role assignment could not be loaded.');
    return found;
  }
  public async updateUserRole(
    userId: string,
    assignmentId: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    const fields = ['scope_type', 'scope_id', 'valid_from', 'valid_until', 'is_active'];
    const entries = Object.entries(values).filter(([key]) => fields.includes(key));
    if (entries.length)
      await this.database.query(
        `UPDATE identity.user_roles SET ${entries.map(([key], i) => `${key}=$${i + 1}`).join(',')},updated_by=$${entries.length + 1},updated_at=now(),row_version=row_version+1 WHERE id=$${entries.length + 2} AND user_id=$${entries.length + 3}`,
        [...entries.map(([, value]) => value), actorUserId, assignmentId, userId],
      );
    const rows = await this.userRoles(userId);
    const found = rows.find((row) => row.id === assignmentId);
    if (!found) throw new NotFoundError('The role assignment was not found.');
    return found;
  }
  public async deleteUserRole(
    userId: string,
    assignmentId: string,
    actorUserId: string,
  ): Promise<void> {
    const result = await this.database.query(
      `DELETE FROM identity.user_roles WHERE id=$1 AND user_id=$2`,
      [assignmentId, userId],
    );
    if (!result.rowCount) throw new NotFoundError('The role assignment was not found.');
    void actorUserId;
  }

  private async updateMaster(
    table: 'roles' | 'permissions',
    id: string,
    values: Record<string, unknown>,
    actorUserId: string,
    role: boolean,
  ): Promise<Record<string, unknown>> {
    const allowed = role
      ? ['code', 'name', 'description']
      : ['code', 'resource', 'action', 'description'];
    const entries = Object.entries(values).filter(([key]) => allowed.includes(key));
    if (!entries.length) throw new DatabaseError('No update fields were supplied.');
    const result = await this.database.query<Row>(
      `UPDATE identity.${table} SET ${entries.map(([key], i) => `${key}=$${i + 1}`).join(',')},updated_by=$${entries.length + 1},updated_at=now(),row_version=row_version+1 WHERE id=$${entries.length + 2} AND is_deleted=false RETURNING *`,
      [...entries.map(([, value]) => value), actorUserId, id],
    );
    if (!result.rows[0])
      throw new NotFoundError(`The ${role ? 'role' : 'permission'} was not found.`);
    return role ? mapRole(result.rows[0]) : mapPermission(result.rows[0]);
  }
}

function mapUser(row: Row): AuthUser {
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
function mapRole(row: Row): Record<string, unknown> {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    isSystem: row.is_system,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
function mapPermission(row: Row): Record<string, unknown> {
  return {
    id: row.id,
    code: row.code,
    resource: row.resource,
    action: row.action,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
function mapUserRole(row: Row): Record<string, unknown> {
  return {
    id: row.id,
    userId: row.user_id,
    roleId: row.role_id,
    roleCode: row.role_code,
    roleName: row.role_name,
    scopeType: row.scope_type,
    scopeId: row.scope_id,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
