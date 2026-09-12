/**
 * Rotates refresh tokens and manages current, other, and all user sessions.
 * Used backward by SessionManagementController; connects forward to token and session persistence adapters.
 * Session mutations are atomic inside the global operation transaction.
 */
import { Injectable } from '@nestjs/common';
import {
  AuthenticationError,
  NotFoundError,
  RefreshTokenReuseError,
  SessionRevokedError,
} from '@shared/errors';
import { AuthWorkflowService } from '../../application/workflow/auth-workflow.service';
import { toAuthInput, type AuthRequestHeaders } from '../../contracts/auth-context';
import { AuthTokenService } from '../../infrastructure/token/auth-token.service';
import { SessionRepository } from './session.repository';

type AuthInput = object;

@Injectable()
export class SessionManagementService {
  public constructor(
    private readonly workflow: AuthWorkflowService,
    private readonly tokens: AuthTokenService,
    private readonly sessions: SessionRepository,
  ) {}

  async refresh(input: AuthInput, _headers: AuthRequestHeaders) {
    const values = toAuthInput(input);
    const refreshToken = String(values.refreshToken);
    const claims = this.tokens.decode(refreshToken, 'refresh');
    if (!claims.sid || !claims.fam)
      throw new AuthenticationError('The supplied token is invalid or expired.');
    // The row lock makes refresh-token rotation one-consumer: a concurrent request
    // waits, then observes the rotated hash and is rejected as token reuse.
    const session = await this.sessions.findSessionForUpdate(claims.sid);
    if (
      !session ||
      session.userId !== claims.sub ||
      session.familyId !== claims.fam ||
      session.revokedAt ||
      session.expiresAt <= new Date()
    )
      throw new SessionRevokedError();
    if (session.refreshTokenHash !== this.tokens.hash(refreshToken, 'refresh-token')) {
      await this.sessions.revokeSession(session.id, 'refresh_token_reuse');
      throw new RefreshTokenReuseError();
    }
    const user = await this.workflow.repository.findUserById(claims.sub);
    if (!user) throw new AuthenticationError('The supplied token is invalid or expired.');
    const refresh = this.tokens.createRefresh(user.id, session.id, session.familyId);
    // Rotate the stored hash before returning the replacement refresh token.
    await this.sessions.rotateSession(
      session.id,
      this.tokens.hash(refresh.token, 'refresh-token'),
      refresh.expiresAt,
    );
    const access = this.tokens.createAccess(user.id, session.id, ['refresh_token']);
    return this.workflow.tokenResponse(user, access, refresh);
  }

  async logout(input: AuthInput) {
    const refreshToken = String(toAuthInput(input).refreshToken);
    const claims = this.tokens.decode(refreshToken, 'refresh');
    if (claims.sid) await this.sessions.revokeSession(claims.sid, 'logout');
    return { message: 'The session has been logged out.' };
  }

  async logoutOthers(authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    await this.sessions.revokeOtherSessions(principal.userId, principal.sessionId);
    return { message: 'All other sessions have been logged out.' };
  }

  async logoutAll(authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    await this.sessions.revokeAllSessions(principal.userId, 'logout_all');
    return { message: 'All sessions have been logged out.' };
  }

  async list(authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    const sessions = await this.sessions.listSessions(principal.userId);
    return {
      sessions: sessions.map((session) => ({
        ...session,
        current: session.id === principal.sessionId,
      })),
    };
  }

  async revoke(sessionId: string, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    const session = await this.sessions.findSession(sessionId);
    if (!session || session.userId !== principal.userId)
      throw new NotFoundError('The session was not found.');
    await this.sessions.revokeSession(sessionId, 'user_requested');
    return { message: 'The session has been revoked.' };
  }
}
