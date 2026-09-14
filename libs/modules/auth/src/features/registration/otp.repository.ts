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
import { loadAuthSql } from '../../infrastructure/persistence/sql-loader';

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
    const result = await this.database.query<Row>(loadAuthSql('otp.create'), [
      input.id,
      input.channel,
      input.destinationHash,
      input.purpose,
      input.otpHash,
      input.expiresAt,
      input.maxAttempts,
    ]);
    return { id: result.rows[0].id, expiresAt: result.rows[0].expires_at };
  }

  // * Function [findOtp]: Handles the findOtp operation for this authentication component.
  public async findOtp(id: string): Promise<OtpRecord | null> {
    // The row lock serializes simultaneous verification attempts for one challenge.
    const result = await this.database.query<Row>(loadAuthSql('otp.find-for-update'), [id]);
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
    await this.database.query(loadAuthSql('otp.consume'), [id, attempts, consumed, blocked]);
  }
}
