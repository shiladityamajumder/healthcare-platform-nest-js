// * Auth module: Implements password recovery and password credential lifecycle use cases.
// * File: src/features/password-management/password-management.service.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Handles password recovery, reset-token exchange, change, and initial password setup.
 * Used backward by PasswordManagementController; connects forward to identity, session, token, and OTP workflows.
 * Password/session mutations are atomic inside the global operation transaction.
 */
import { Injectable } from '@nestjs/common';
import { hash as argonHash, verify as argonVerify } from 'argon2';
import {
  AuthenticationError,
  ConflictError,
  InvalidCredentialsError,
  ValidationError,
} from '@shared/errors';
import {
  AuthWorkflowService,
  validatePassword,
} from '../../application/workflow/auth-workflow.service';
import { authContext, toAuthInput, type AuthRequestHeaders } from '../../contracts/auth-context';
import { AuthTokenService } from '../../infrastructure/token/auth-token.service';
import { normalizeEmail, normalizePhone } from '../identity/identity.validation';
import { IdentityRepository } from '../registration/identity.repository';
import { SessionRepository } from '../session-management/session.repository';

type AuthInput = object;

@Injectable()
export class PasswordManagementService {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(
    private readonly workflow: AuthWorkflowService,
    private readonly identity: IdentityRepository,
    private readonly tokens: AuthTokenService,
    private readonly sessions: SessionRepository,
  ) {}

  // * Function [forgot]: Handles the forgot operation for this authentication component.
  forgot(input: AuthInput) {
    const values = toAuthInput(input);
    const destination =
      values.channel === 'email'
        ? normalizeEmail(String(values.email))
        : normalizePhone(String(values.phoneCountryCode), String(values.phoneNumber)).join('');
    return this.workflow.issueOtp(
      values.channel === 'email' ? 'email' : 'sms',
      destination,
      values.channel === 'email' ? 'password_reset_email' : 'password_reset_phone',
    );
  }

  // * Function [verifyReset]: Validates the supplied authentication data and rejects unsafe input.
  async verifyReset(input: AuthInput) {
    const values = toAuthInput(input);
    const destination =
      values.channel === 'email'
        ? normalizeEmail(String(values.email))
        : normalizePhone(String(values.phoneCountryCode), String(values.phoneNumber)).join('');
    const purpose = values.channel === 'email' ? 'password_reset_email' : 'password_reset_phone';
    // Consuming the OTP and issuing reset proof occur in one transaction.
    await this.workflow.verifyOtp(
      String(values.challengeId),
      String(values.code),
      purpose,
      values.channel === 'email' ? 'email' : 'sms',
      destination,
    );
    const user =
      values.channel === 'email'
        ? await this.identity.findUserByEmail(destination)
        : await this.identity.findUserByPhone(
            ...normalizePhone(String(values.phoneCountryCode), String(values.phoneNumber)),
          );
    if (!user) throw new AuthenticationError('The reset request could not be completed.');
    const proof = this.tokens.createReset(
      user.id,
      String(values.challengeId),
      String(values.channel),
      this.tokens.hash(destination, 'otp-destination'),
    );
    return { resetToken: proof.token, expiresAt: proof.expiresAt };
  }

  // * Function [reset]: Updates the requested authentication state after validation.
  async reset(input: AuthInput, headers: AuthRequestHeaders) {
    const values = toAuthInput(input);
    const claims = this.tokens.decode(String(values.resetToken), 'password_reset');
    if (!claims.challenge_id || !claims.channel || !claims.destination_hash)
      throw new AuthenticationError('The supplied reset proof is invalid or expired.');
    validatePassword(String(values.newPassword));
    // Password update, session revocation, and replacement session are one atomic unit.
    const user = await this.identity.findUserById(claims.sub);
    if (!user) throw new AuthenticationError('The supplied reset proof is invalid or expired.');
    const updated = await this.identity.updateUser(user.id, {
      password_hash: await argonHash(String(values.newPassword)),
      status: 'active',
      failed_login_count: 0,
      locked_until: null,
    });
    await this.sessions.revokeAllSessions(user.id, 'password_reset');
    return this.workflow.issueTokens(updated, authContext(headers), ['password_reset']);
  }

  // * Function [change]: Updates the requested authentication state after validation.
  async change(input: AuthInput, authorization: string | undefined, headers: AuthRequestHeaders) {
    const values = toAuthInput(input);
    const principal = await this.workflow.requirePrincipal(authorization);
    const user = await this.identity.findUserById(principal.userId);
    if (!user?.email)
      throw new ValidationError('The current password cannot be changed for this identity.');
    const credential = await this.identity.findUserForLogin({ email: user.email });
    if (
      !credential?.passwordHash ||
      !(await argonVerify(credential.passwordHash, String(values.currentPassword)))
    )
      throw new InvalidCredentialsError();
    validatePassword(String(values.newPassword), user.email);
    // Revoke existing sessions before returning the newly issued session tokens.
    const updated = await this.identity.updateUser(principal.userId, {
      password_hash: await argonHash(String(values.newPassword)),
    });
    await this.sessions.revokeAllSessions(user.id, 'password_changed');
    return this.workflow.issueTokens(updated, authContext(headers), ['password']);
  }

  // * Function [set]: Creates or issues the requested authentication resource.
  async set(input: AuthInput, authorization: string | undefined, headers: AuthRequestHeaders) {
    const values = toAuthInput(input);
    const principal = await this.workflow.requirePrincipal(authorization);
    const user = await this.identity.findUserById(principal.userId);
    if (!user) throw new AuthenticationError();
    const credential = user.email
      ? await this.identity.findUserForLogin({ email: user.email })
      : null;
    if (credential?.passwordHash) throw new ConflictError('Password is already configured.');
    validatePassword(String(values.newPassword));
    const updated = await this.identity.updateUser(user.id, {
      password_hash: await argonHash(String(values.newPassword)),
    });
    await this.sessions.revokeAllSessions(user.id, 'password_set');
    return this.workflow.issueTokens(updated, authContext(headers), ['password']);
  }
}
