// * Auth module: Persists sessions and their revocation or rotation state.
// * File: src/features/session-management/session.repository.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * PostgreSQL adapter for session creation, rotation, revocation, and listing.
 * Used backward by SessionManagementService and the composition facade; connects forward to PostgresDatabase.
 * All mutations reuse the caller's operation transaction.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PostgresDatabase } from '@platform/database';
import type { AuthSession } from '../../contracts/auth.ports';

type Row = Record<string, any>;

@Injectable()
export class SessionRepository {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(private readonly database: PostgresDatabase) {}

  // * Function [createSession]: Creates or issues the requested authentication resource.
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

  // * Function [findSession]: Handles the findSession operation for this authentication component.
  public async findSession(id: string): Promise<AuthSession | null> {
    return this.loadSession(id, false);
  }

  /** Lock the session row so refresh-token rotation is single-consumer under concurrency. */
  // * Function [findSessionForUpdate]: Handles the findSessionForUpdate operation for this authentication component.
  public async findSessionForUpdate(id: string): Promise<AuthSession | null> {
    return this.loadSession(id, true);
  }

  // * Function [loadSession]: Handles the loadSession operation for this authentication component.
  private async loadSession(id: string, forUpdate: boolean): Promise<AuthSession | null> {
    // Refresh uses FOR UPDATE; ordinary authentication reads remain non-locking.
    const result = await this.database.query<Row>(
      `SELECT id, user_id, token_family_id, refresh_token_hash, expires_at, revoked_at, device_id FROM identity.sessions WHERE id = $1${forUpdate ? ' FOR UPDATE' : ''}`,
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

  // * Function [rotateSession]: Handles the rotateSession operation for this authentication component.
  public async rotateSession(id: string, refreshTokenHash: string, expiresAt: Date): Promise<void> {
    await this.database.query(
      `UPDATE identity.sessions SET refresh_token_hash = $2, expires_at = $3, last_seen_at = now(), updated_at = now(), row_version = row_version + 1 WHERE id = $1 AND revoked_at IS NULL`,
      [id, refreshTokenHash, expiresAt],
    );
  }

  // * Function [revokeSession]: Invalidates or removes the requested authentication state.
  public async revokeSession(id: string, reason: string): Promise<void> {
    await this.database.query(
      `UPDATE identity.sessions SET revoked_at = COALESCE(revoked_at, now()), revoke_reason = $2, updated_at = now(), row_version = row_version + 1 WHERE id = $1`,
      [id, reason],
    );
  }

  // * Function [revokeOtherSessions]: Invalidates or removes the requested authentication state.
  public async revokeOtherSessions(userId: string, currentSessionId: string): Promise<void> {
    await this.database.query(
      `UPDATE identity.sessions SET revoked_at = now(), revoke_reason = 'logout_others', updated_at = now(), row_version = row_version + 1 WHERE user_id = $1 AND id <> $2 AND revoked_at IS NULL`,
      [userId, currentSessionId],
    );
  }

  // * Function [revokeAllSessions]: Invalidates or removes the requested authentication state.
  public async revokeAllSessions(userId: string, reason: string): Promise<void> {
    await this.database.query(
      `UPDATE identity.sessions SET revoked_at = now(), revoke_reason = $2, updated_at = now(), row_version = row_version + 1 WHERE user_id = $1 AND revoked_at IS NULL`,
      [userId, reason],
    );
  }

  // * Function [listSessions]: Handles the listSessions operation for this authentication component.
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
}
