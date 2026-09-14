// * Auth module: Persists identities, profiles, OTP challenges, and role assignments.
// * File: src/features/registration/otp.repository.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * PostgreSQL adapter for OTP challenges and attempt consumption.
 * Used backward by registration/login/password workflows through AuthWorkflowService; connects forward to PostgresDatabase.
 * Verification locks the challenge row so attempts are consumed atomically.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PostgresDatabase } from '@platform/database';
import type { OtpRecord } from '../../contracts/auth.ports';

type Row = Record<string, any>;

@Injectable()
export class OtpRepository {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(private readonly database: PostgresDatabase) {}

  // * Function [createOtp]: Creates or issues the requested authentication resource.
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

  // * Function [findOtp]: Handles the findOtp operation for this authentication component.
  public async findOtp(id: string): Promise<OtpRecord | null> {
    // The row lock serializes simultaneous verification attempts for one challenge.
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

  // * Function [consumeOtp]: Invalidates or removes the requested authentication state.
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
}
