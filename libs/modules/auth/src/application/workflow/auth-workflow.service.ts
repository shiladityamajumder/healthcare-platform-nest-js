// * Auth module: Coordinates cross-feature authentication workflows and security checks.
// * File: src/application/workflow/auth-workflow.service.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Coordinates cross-feature auth workflows such as OTPs, identities, tokens, and authorization.
 * Used backward by feature services; connects forward to the repository and token ports.
 * HTTP atomicity is supplied by the global operation-execution interceptor.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { hash as argonHash } from 'argon2';
import { randomInt, randomUUID } from 'node:crypto';
import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  InfrastructureUnavailableError,
  OtpAlreadyUsedError,
  OtpAttemptsExceededError,
  OtpExpiredError,
  OtpInvalidError,
  ValidationError,
} from '@shared/errors';
import {
  AUTH_REPOSITORY,
  AUTH_TOKEN_SERVICE,
  type AuthPrincipal,
  type AuthRepositoryPort,
  type AuthUser,
  type TokenServicePort,
} from '../../contracts/auth.ports';
import {
  AuthNotificationMessageService,
  type AuthNotificationChannel,
} from '../notifications/auth-notification-message.service';

type Input = Record<string, any>;

@Injectable()
export class AuthWorkflowService {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(
    @Inject(AUTH_REPOSITORY) public readonly repository: AuthRepositoryPort,
    @Inject(AUTH_TOKEN_SERVICE) private readonly tokens: TokenServicePort,
    private readonly notificationMessages: AuthNotificationMessageService,
  ) {}

  // * Function [requirePrincipal]: Validates the supplied authentication data and rejects unsafe input.
  public async requirePrincipal(authorization?: string): Promise<AuthPrincipal> {
    // Validate both the signed access token and its server-side session state.
    if (!authorization?.startsWith('Bearer ')) throw new AuthenticationError();
    const claims = this.tokens.decode(authorization.slice(7), 'access');
    if (!claims.sid) throw new AuthenticationError();
    const session = await this.repository.findSession(claims.sid);
    if (
      !session ||
      session.userId !== claims.sub ||
      session.revokedAt ||
      session.expiresAt <= new Date()
    )
      throw new AuthenticationError();
    const user = await this.repository.findUserById(claims.sub);
    if (!user || user.status !== 'active') throw new AuthenticationError();
    const auth = await this.repository.authorization(user.id);
    return {
      userId: user.id,
      sessionId: session.id,
      roles: auth.roles,
      permissions: auth.permissions,
    };
  }

  // * Function [issueOtp]: Creates or issues the requested authentication resource.
  public async issueOtp(
    channel: AuthNotificationChannel,
    destination: string,
    purpose: string,
  ): Promise<Record<string, unknown>> {
    // Store only hashes; the plain OTP is returned only in development mode.
    const challengeId = randomUUID();
    const code = String(randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + Number(process.env.OTP_TTL_SECONDS ?? 300) * 1000);
    await this.repository.createOtp({
      id: challengeId,
      channel,
      destinationHash: this.tokens.hash(destination, 'otp-destination'),
      purpose,
      otpHash: this.tokens.otpHash(challengeId, code),
      expiresAt,
      maxAttempts: Number(process.env.OTP_MAX_ATTEMPTS ?? 5),
    });
    const notification = this.notificationMessages.buildOtpMessage({
      channel,
      destination,
      purpose,
      challengeId,
      code,
      expiresAt,
    });
    // TODO: Dispatch `notification` through the provider-backed NotificationService after commit.
    // await this.notificationService.send(notification);
    void notification;
    return {
      accepted: true,
      challengeId,
      expiresAt,
      retryAfterSeconds: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS ?? 60),
      developmentOtp: process.env.OTP_DEV_EXPOSE_CODE === 'true' ? code : null,
    };
  }

  // * Function [verifyOtp]: Validates the supplied authentication data and rejects unsafe input.
  public async verifyOtp(
    id: string,
    code: string,
    purpose: string,
    channel: string,
    destination: string,
  ): Promise<void> {
    // OtpRepository locks this challenge row before these checks and updates.
    const challenge = await this.repository.findOtp(id);
    if (
      !challenge ||
      challenge.channel !== channel ||
      challenge.purpose !== purpose ||
      challenge.destinationHash !== this.tokens.hash(destination, 'otp-destination')
    )
      throw new OtpInvalidError();
    if (challenge.consumedAt) throw new OtpAlreadyUsedError();
    if (challenge.blockedAt || challenge.attempts >= challenge.maxAttempts)
      throw new OtpAttemptsExceededError();
    if (challenge.expiresAt <= new Date()) throw new OtpExpiredError();
    const attempts = challenge.attempts + 1;
    const valid = challenge.otpHash === this.tokens.otpHash(id, code);
    // Record the failed attempt before returning the validation error.
    await this.repository.consumeOtp(
      id,
      attempts,
      false,
      !valid && attempts >= challenge.maxAttempts,
    );
    if (!valid) throw new OtpInvalidError();
    await this.repository.consumeOtp(id, attempts, true, false);
  }

  // * Function [issueTokens]: Creates or issues the requested authentication resource.
  public async issueTokens(
    user: AuthUser,
    context: Input,
    methods: string[],
  ): Promise<Record<string, unknown>> {
    // Persist the refresh-token hash before returning either token to the client.
    const sessionId = randomUUID();
    const familyId = randomUUID();
    const refresh = this.tokens.createRefresh(user.id, sessionId, familyId);
    await this.repository.createSession({
      id: sessionId,
      userId: user.id,
      refreshTokenHash: this.tokens.hash(refresh.token, 'refresh-token'),
      familyId,
      deviceId: context.deviceId,
      deviceType: context.deviceType,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      expiresAt: refresh.expiresAt,
    });
    const access = this.tokens.createAccess(user.id, sessionId, methods);
    return this.tokenResponse(user, access, refresh);
  }

  // * Function [tokenResponse]: Handles the tokenResponse operation for this authentication component.
  public tokenResponse(
    user: AuthUser,
    access: { token: string; expiresAt: Date },
    refresh: { token: string; expiresAt: Date },
  ): Record<string, unknown> {
    return {
      accessToken: access.token,
      refreshToken: refresh.token,
      tokenType: 'Bearer',
      accessExpiresAt: access.expiresAt,
      refreshExpiresAt: refresh.expiresAt,
      user,
    };
  }

  // * Function [createIdentity]: Creates or issues the requested authentication resource.
  public async createIdentity(input: {
    email?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
    passwordHash?: string | null;
    status: string;
    input: Input;
  }): Promise<AuthUser> {
    try {
      // These identity, profile, verification, and role writes share one request transaction.
      const user = await this.repository.createUser({
        email: input.email,
        phoneCountryCode: input.phoneCountryCode,
        phoneNumber: input.phoneNumber,
        passwordHash: input.passwordHash,
        status: input.status,
        preferredLocale: input.input.preferredLocale ?? 'en-IN',
        timezone: input.input.timezone ?? 'Asia/Kolkata',
        termsVersion: input.input.termsVersion,
        privacyVersion: input.input.privacyVersion,
      });
      await this.repository.createProfile(user.id, input.input);
      if (input.phoneNumber)
        await this.repository.updateUser(user.id, { phone_verified_at: new Date() });
      const role = await this.repository.findRoleByCode(
        process.env.DEFAULT_ROLE_CODE ?? 'customer',
      );
      if (!role)
        throw new InfrastructureUnavailableError('The default registration role is unavailable.');
      await this.repository.assignRole(user.id, role.id);
      return this.repository.findUserById(user.id) as Promise<AuthUser>;
    } catch (error) {
      if ((error as { code?: string }).code === '23505')
        throw new ConflictError('The identity is already registered.');
      throw error;
    }
  }

  // * Function [hashPassword]: Transforms the supplied value into the format required by this authentication flow.
  public async hashPassword(password: string, identity?: string): Promise<string> {
    validatePassword(password, identity);
    return argonHash(password);
  }

  // * Function [requirePermission]: Validates the supplied authentication data and rejects unsafe input.
  public requirePermission(principal: AuthPrincipal, permission: string): void {
    if (!principal.permissions.includes(permission))
      throw new AuthorizationError('You do not have permission to perform this operation.');
  }
}

// * Function [validatePassword]: Validates the supplied authentication data and rejects unsafe input.
export function validatePassword(password: string, identity?: string): void {
  const minimum = Number(process.env.PASSWORD_MIN_LENGTH ?? 8);
  if (
    !password ||
    password.length < minimum ||
    password.length > 128 ||
    password.trim() !== password ||
    password.includes('\0')
  )
    throw new ValidationError(`Password must contain at least ${minimum} characters.`);
  // Require three of four character classes without enforcing a brittle fixed pattern.
  let categories = 0;
  for (const pattern of [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/])
    if (pattern.test(password)) categories++;
  if (categories < 3)
    throw new ValidationError(
      'Password must use at least three of uppercase, lowercase, number, and symbol.',
    );
  if (identity && password.toLowerCase().includes(identity.toLowerCase()))
    throw new ValidationError('Password must not contain the account identity.');
}
