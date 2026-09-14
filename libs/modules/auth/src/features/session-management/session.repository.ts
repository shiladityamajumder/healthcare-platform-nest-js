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
import { loadAuthSql } from '../../infrastructure/persistence/sql-loader';

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
    await this.database.query(loadAuthSql('session.create'), [
      input.id,
      input.userId,
      input.refreshTokenHash,
      input.familyId,
      input.deviceId ?? null,
      input.deviceType ?? null,
      input.ipAddress ?? null,
      input.userAgent ?? null,
      input.expiresAt,
    ]);
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
      loadAuthSql(forUpdate ? 'session.find-for-update' : 'session.find'),
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
    await this.database.query(loadAuthSql('session.rotate'), [id, refreshTokenHash, expiresAt]);
  }

  // * Function [revokeSession]: Invalidates or removes the requested authentication state.
  public async revokeSession(id: string, reason: string): Promise<void> {
    await this.database.query(loadAuthSql('session.revoke'), [id, reason]);
  }

  // * Function [revokeOtherSessions]: Invalidates or removes the requested authentication state.
  public async revokeOtherSessions(userId: string, currentSessionId: string): Promise<void> {
    await this.database.query(loadAuthSql('session.revoke-others'), [userId, currentSessionId]);
  }

  // * Function [revokeAllSessions]: Invalidates or removes the requested authentication state.
  public async revokeAllSessions(userId: string, reason: string): Promise<void> {
    await this.database.query(loadAuthSql('session.revoke-all'), [userId, reason]);
  }

  // * Function [listSessions]: Handles the listSessions operation for this authentication component.
  public async listSessions(userId: string): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(loadAuthSql('session.list'), [userId]);
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
