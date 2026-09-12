/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Injectable, Inject } from '@nestjs/common';
import { hash as argonHash, verify as argonVerify } from 'argon2';
import { randomInt, randomUUID } from 'node:crypto';
import {
  ConflictError,
  AuthenticationError,
  AuthorizationError,
  InfrastructureUnavailableError,
  InvalidCredentialsError,
  NotFoundError,
  OtpAlreadyUsedError,
  OtpAttemptsExceededError,
  OtpExpiredError,
  OtpInvalidError,
  RefreshTokenReuseError,
  SessionRevokedError,
  ValidationError,
} from '@shared/errors';
import {
  AUTH_REPOSITORY,
  AUTH_TOKEN_SERVICE,
  type AuthPrincipal,
  type AuthRepositoryPort,
  type AuthUser,
  type TokenServicePort,
} from '../domain/ports/auth.ports';

type Input = Record<string, any>;

@Injectable()
export class AuthApplicationService {
  public constructor(
    @Inject(AUTH_REPOSITORY) private readonly repository: AuthRepositoryPort,
    @Inject(AUTH_TOKEN_SERVICE) private readonly tokens: TokenServicePort,
  ) {}

  public capabilities(): Record<string, unknown> {
    return {
      schema: 'auth-capabilities',
      registration: { emailEnabled: true, phoneEnabled: true },
      login: { passwordEnabled: true, phoneOtpEnabled: true },
      verification: {
        emailRequired: process.env.EMAIL_VERIFICATION_REQUIRED !== 'false',
        phoneRequired: process.env.PHONE_VERIFICATION_REQUIRED !== 'false',
      },
      passwordPolicy: {
        minimumLength: Number(process.env.PASSWORD_MIN_LENGTH ?? 8),
        minimumCharacterClasses: 3,
      },
      supportedPlatforms: ['android', 'ios', 'web'],
    };
  }
  public jwks(): Array<Record<string, string>> {
    const keys = this.tokens.jwks();
    if (!keys.length) throw new NotFoundError('JWKS is available only when RS256 is configured.');
    return keys;
  }

  public async registerEmail(input: Input, context: Input): Promise<Record<string, unknown>> {
    const email = normalizeEmail(input.email);
    const verificationRequired = process.env.EMAIL_VERIFICATION_REQUIRED !== 'false';
    if (await this.repository.findUserByEmail(email))
      throw new ConflictError('The identity is already registered.', { field: 'email' });
    validatePassword(input.password, email);
    const passwordHash = await argonHash(input.password);
    const user = await this.createIdentity({
      email,
      passwordHash,
      status: verificationRequired ? 'pending' : 'active',
      input,
      context,
    });
    if (!verificationRequired)
      return {
        user,
        verificationRequired: false,
        challengeId: null,
        expiresAt: null,
        developmentOtp: null,
        tokens: await this.issueTokens(user, context, ['password']),
      };
    const challenge = await this.issueOtp('email', email, 'verify_email');
    return {
      user,
      verificationRequired: true,
      challengeId: challenge.challengeId,
      expiresAt: challenge.expiresAt,
      developmentOtp: challenge.developmentOtp,
      tokens: null,
    };
  }

  public async requestPhoneRegistrationOtp(input: Input): Promise<Record<string, unknown>> {
    const phone = normalizePhone(input.phoneCountryCode, input.phoneNumber);
    if (await this.repository.findUserByPhone(...phone))
      throw new ConflictError('The identity is already registered.');
    return this.issueOtp('sms', phone.join(''), 'registration_phone');
  }
  public async verifyPhoneRegistrationOtp(
    input: Input,
    context: Input,
  ): Promise<Record<string, unknown>> {
    const phone = normalizePhone(input.phoneCountryCode, input.phoneNumber);
    await this.verifyOtp(
      input.challengeId,
      input.code,
      'registration_phone',
      'sms',
      phone.join(''),
    );
    if (await this.repository.findUserByPhone(...phone))
      throw new ConflictError('The identity is already registered.');
    const passwordHash = input.password
      ? await this.checkedPasswordHash(input.password, phone[1])
      : null;
    const user = await this.createIdentity({
      phoneCountryCode: phone[0],
      phoneNumber: phone[1],
      passwordHash,
      status: 'active',
      input,
      context,
    });
    return this.issueTokens(user, context, passwordHash ? ['otp', 'password'] : ['otp']);
  }

  public async requestEmailVerificationOtp(input: Input): Promise<Record<string, unknown>> {
    return this.issueOtp('email', normalizeEmail(input.email), 'verify_email');
  }
  public async verifyEmail(input: Input, context: Input): Promise<Record<string, unknown>> {
    const email = normalizeEmail(input.email);
    await this.verifyOtp(input.challengeId, input.code, 'verify_email', 'email', email);
    const user = await this.repository.findUserByEmail(email);
    if (!user) throw new AuthenticationError('The verification request could not be completed.');
    const updated = await this.repository.updateUser(user.id, {
      status: 'active',
      email_verified_at: new Date(),
    });
    return this.issueTokens(updated, context, ['email_verification']);
  }

  public async loginPassword(input: Input, context: Input): Promise<Record<string, unknown>> {
    const identity =
      input.channel === 'email'
        ? { email: normalizeEmail(input.email) }
        : (() => {
            const phone = normalizePhone(input.phoneCountryCode, input.phoneNumber);
            return { phoneCountryCode: phone[0], phoneNumber: phone[1] };
          })();
    const user = await this.repository.findUserForLogin(identity);
    if (!user || !user.passwordHash || !(await argonVerify(user.passwordHash, input.password)))
      throw new InvalidCredentialsError();
    if (user.status !== 'active') throw new AuthenticationError('The account is not available.');
    if (user.lockedUntil && user.lockedUntil > new Date())
      throw new AuthenticationError('The account is temporarily locked.');
    const updated = await this.repository.updateUser(user.id, {
      last_login_at: new Date(),
      failed_login_count: 0,
      locked_until: null,
    });
    return this.issueTokens(updated, context, ['password']);
  }
  public async requestPhoneLoginOtp(input: Input): Promise<Record<string, unknown>> {
    const phone = normalizePhone(input.phoneCountryCode, input.phoneNumber);
    return this.issueOtp('sms', phone.join(''), 'login_phone');
  }
  public async verifyPhoneLoginOtp(input: Input, context: Input): Promise<Record<string, unknown>> {
    const phone = normalizePhone(input.phoneCountryCode, input.phoneNumber);
    await this.verifyOtp(input.challengeId, input.code, 'login_phone', 'sms', phone.join(''));
    const user = await this.repository.findUserByPhone(...phone);
    if (!user || user.status !== 'active' || !user.phoneVerified)
      throw new InvalidCredentialsError();
    return this.issueTokens(user, context, ['otp']);
  }

  public async refresh(input: Input, _context: Input): Promise<Record<string, unknown>> {
    const claims = this.tokens.decode(input.refreshToken, 'refresh');
    if (!claims.sid || !claims.fam)
      throw new AuthenticationError('The supplied token is invalid or expired.');
    const session = await this.repository.findSession(claims.sid);
    if (
      !session ||
      session.userId !== claims.sub ||
      session.familyId !== claims.fam ||
      session.revokedAt ||
      session.expiresAt <= new Date()
    )
      throw new SessionRevokedError();
    if (session.refreshTokenHash !== this.tokens.hash(input.refreshToken, 'refresh-token')) {
      await this.repository.revokeSession(session.id, 'refresh_token_reuse');
      throw new RefreshTokenReuseError();
    }
    const user = await this.repository.findUserById(claims.sub);
    if (!user) throw new AuthenticationError('The supplied token is invalid or expired.');
    const refresh = this.tokens.createRefresh(user.id, session.id, session.familyId);
    await this.repository.rotateSession(
      session.id,
      this.tokens.hash(refresh.token, 'refresh-token'),
      refresh.expiresAt,
    );
    const access = this.tokens.createAccess(user.id, session.id, ['refresh_token']);
    return this.tokenResponse(user, access, refresh);
  }
  public async logout(input: Input): Promise<Record<string, string>> {
    const claims = this.tokens.decode(input.refreshToken, 'refresh');
    if (claims.sid) await this.repository.revokeSession(claims.sid, 'logout');
    return { message: 'The session has been logged out.' };
  }
  public async logoutOthers(principal: AuthPrincipal): Promise<Record<string, string>> {
    await this.repository.revokeOtherSessions(principal.userId, principal.sessionId);
    return { message: 'All other sessions have been logged out.' };
  }
  public async logoutAll(principal: AuthPrincipal): Promise<Record<string, string>> {
    await this.repository.revokeAllSessions(principal.userId, 'logout_all');
    return { message: 'All sessions have been logged out.' };
  }

  public async listSessions(principal: AuthPrincipal): Promise<Record<string, unknown>> {
    const sessions = await this.repository.listSessions(principal.userId);
    return {
      sessions: sessions.map((session) => ({
        ...session,
        current: session.id === principal.sessionId,
      })),
    };
  }
  public async revokeSession(
    principal: AuthPrincipal,
    sessionId: string,
  ): Promise<Record<string, string>> {
    const session = await this.repository.findSession(sessionId);
    if (!session || session.userId !== principal.userId)
      throw new NotFoundError('The session was not found.');
    await this.repository.revokeSession(sessionId, 'user_requested');
    return { message: 'The session has been revoked.' };
  }

  public async forgotPassword(input: Input): Promise<Record<string, unknown>> {
    const destination =
      input.channel === 'email'
        ? normalizeEmail(input.email)
        : normalizePhone(input.phoneCountryCode, input.phoneNumber).join('');
    return this.issueOtp(
      input.channel === 'email' ? 'email' : 'sms',
      destination,
      input.channel === 'email' ? 'password_reset_email' : 'password_reset_phone',
    );
  }
  public async verifyResetOtp(input: Input): Promise<Record<string, unknown>> {
    const destination =
      input.channel === 'email'
        ? normalizeEmail(input.email)
        : normalizePhone(input.phoneCountryCode, input.phoneNumber).join('');
    const purpose = input.channel === 'email' ? 'password_reset_email' : 'password_reset_phone';
    await this.verifyOtp(
      input.challengeId,
      input.code,
      purpose,
      input.channel === 'email' ? 'email' : 'sms',
      destination,
    );
    const user =
      input.channel === 'email'
        ? await this.repository.findUserByEmail(destination)
        : await this.repository.findUserByPhone(
            ...normalizePhone(input.phoneCountryCode, input.phoneNumber),
          );
    if (!user) throw new AuthenticationError('The reset request could not be completed.');
    const proof = this.tokens.createReset(
      user.id,
      input.challengeId,
      input.channel,
      this.tokens.hash(destination, 'otp-destination'),
    );
    return { resetToken: proof.token, expiresAt: proof.expiresAt };
  }
  public async resetPassword(input: Input, context: Input): Promise<Record<string, unknown>> {
    const claims = this.tokens.decode(input.resetToken, 'password_reset');
    if (!claims.challenge_id || !claims.channel || !claims.destination_hash)
      throw new AuthenticationError('The supplied reset proof is invalid or expired.');
    validatePassword(input.newPassword);
    const user = await this.repository.findUserById(claims.sub);
    if (!user) throw new AuthenticationError('The supplied reset proof is invalid or expired.');
    const updated = await this.repository.updateUser(user.id, {
      password_hash: await argonHash(input.newPassword),
      status: 'active',
      failed_login_count: 0,
      locked_until: null,
    });
    await this.repository.revokeAllSessions(user.id, 'password_reset');
    return this.issueTokens(updated, context, ['password_reset']);
  }
  public async changePassword(
    input: Input,
    principal: AuthPrincipal,
    context: Input,
  ): Promise<Record<string, unknown>> {
    const user = await this.repository.findUserById(principal.userId);
    if (!user?.email)
      throw new ValidationError('The current password cannot be changed for this identity.');
    const credential = await this.repository.findUserForLogin({ email: user.email });
    if (
      !credential?.passwordHash ||
      !(await argonVerify(credential.passwordHash, input.currentPassword))
    )
      throw new InvalidCredentialsError();
    validatePassword(input.newPassword, user.email);
    const updated = await this.repository.updateUser(user.id, {
      password_hash: await argonHash(input.newPassword),
    });
    await this.repository.revokeAllSessions(user.id, 'password_changed');
    return this.issueTokens(updated, context, ['password']);
  }
  public async setPassword(
    input: Input,
    principal: AuthPrincipal,
    context: Input,
  ): Promise<Record<string, unknown>> {
    const user = await this.repository.findUserById(principal.userId);
    if (!user) throw new AuthenticationError();
    const credential = user.email
      ? await this.repository.findUserForLogin({ email: user.email })
      : null;
    if (credential?.passwordHash) throw new ConflictError('Password is already configured.');
    validatePassword(input.newPassword);
    const updated = await this.repository.updateUser(user.id, {
      password_hash: await argonHash(input.newPassword),
    });
    await this.repository.revokeAllSessions(user.id, 'password_set');
    return this.issueTokens(updated, context, ['password']);
  }

  public async getCurrentUser(principal: AuthPrincipal): Promise<AuthUser> {
    const user = await this.repository.findUserById(principal.userId);
    if (!user) throw new AuthenticationError();
    return { ...user };
  }
  public async updateCurrentUser(principal: AuthPrincipal, input: Input): Promise<AuthUser> {
    const values: Record<string, unknown> = {};
    for (const [from, to] of [
      ['preferredLocale', 'preferred_locale'],
      ['timezone', 'timezone'],
    ])
      if (input[from] !== undefined) values[to] = input[from];
    const existing = await this.repository.findUserById(principal.userId);
    if (!existing) throw new AuthenticationError();
    await this.repository.updateUser(principal.userId, values);
    await this.repository.createProfile(principal.userId, {
      firstName: input.firstName,
      lastName: input.lastName,
      preferredName: input.preferredName,
      avatarFileId: input.avatarFileId,
    });
    return this.repository.findUserById(principal.userId) as Promise<AuthUser>;
  }
  public getAuthorization(principal: AuthPrincipal): Record<string, string[]> {
    return { roles: principal.roles.sort(), permissions: principal.permissions.sort() };
  }

  public async listAdminUsers(
    limit: number,
    offset: number,
    search: string | undefined,
    status: string | undefined,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.users.read');
    const result = await this.repository.listUsers(limit, offset, search, status);
    const users = await Promise.all(
      result.rows.map(async (user) => {
        const auth = await this.repository.authorization(user.id);
        return { ...user, roles: auth.roles, permissions: auth.permissions };
      }),
    );
    return {
      data: { users },
      pagination: {
        totalCount: result.total,
        limit,
        offset,
        hasNext: offset + result.rows.length < result.total,
      },
    };
  }
  public async getAdminUser(
    id: string,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.users.read');
    const user = await this.repository.findUserById(id);
    if (!user) throw new NotFoundError('The user was not found.');
    const auth = await this.repository.authorization(id);
    return { ...user, roles: auth.roles, permissions: auth.permissions };
  }
  public async updateUserStatus(
    id: string,
    input: Input,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.users.manage');
    const user = await this.repository.updateUser(id, { status: input.status });
    if (input.revokeSessions !== false) await this.repository.revokeAllSessions(id, input.reason);
    return { ...user };
  }
  public async adminLogoutAll(
    id: string,
    input: Input,
    principal: AuthPrincipal,
  ): Promise<Record<string, string>> {
    this.requirePermission(principal, 'identity.users.manage');
    await this.repository.revokeAllSessions(id, input.reason);
    return { message: 'All sessions have been logged out.' };
  }
  public async listRoles(principal: AuthPrincipal): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.roles.read');
    return { roles: await this.repository.listRoles() };
  }
  public async createRole(
    input: Input,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.roles.manage');
    return this.repository.createRole({
      code: input.code,
      name: input.name,
      description: input.description,
      actorUserId: principal.userId,
    });
  }
  public async getRole(id: string, principal: AuthPrincipal): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.roles.read');
    const row = await this.repository.findRole(id);
    if (!row) throw new NotFoundError('The role was not found.');
    return row;
  }
  public async updateRole(
    id: string,
    input: Input,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.roles.manage');
    return this.repository.updateRole(id, input, principal.userId);
  }
  public async deleteRole(id: string, principal: AuthPrincipal): Promise<Record<string, string>> {
    this.requirePermission(principal, 'identity.roles.manage');
    await this.repository.deleteRole(id, principal.userId);
    return { message: 'The role has been deleted.' };
  }
  public async listPermissions(principal: AuthPrincipal): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.permissions.read');
    return { permissions: await this.repository.listPermissions() };
  }
  public async createPermission(
    input: Input,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.permissions.manage');
    return this.repository.createPermission({ ...input, actorUserId: principal.userId });
  }
  public async getPermission(
    id: string,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.permissions.read');
    const row = await this.repository.findPermission(id);
    if (!row) throw new NotFoundError('The permission was not found.');
    return row;
  }
  public async updatePermission(
    id: string,
    input: Input,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.permissions.manage');
    return this.repository.updatePermission(id, input, principal.userId);
  }
  public async deletePermission(
    id: string,
    principal: AuthPrincipal,
  ): Promise<Record<string, string>> {
    this.requirePermission(principal, 'identity.permissions.manage');
    await this.repository.deletePermission(id, principal.userId);
    return { message: 'The permission has been deleted.' };
  }
  public async rolePermissions(
    id: string,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.permissions.read');
    return { roleId: id, permissions: await this.repository.rolePermissions(id) };
  }
  public async replaceRolePermissions(
    id: string,
    input: Input,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.permissions.manage');
    return {
      roleId: id,
      permissions: await this.repository.replaceRolePermissions(
        id,
        input.permissionIds ?? [],
        principal.userId,
      ),
    };
  }
  public async userRoles(id: string, principal: AuthPrincipal): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.user_roles.read');
    return { assignments: await this.repository.userRoles(id) };
  }
  public async assignUserRole(
    id: string,
    input: Input,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.user_roles.manage');
    return this.repository.assignUserRole(id, input, principal.userId);
  }
  public async updateUserRole(
    id: string,
    assignmentId: string,
    input: Input,
    principal: AuthPrincipal,
  ): Promise<Record<string, unknown>> {
    this.requirePermission(principal, 'identity.user_roles.manage');
    return this.repository.updateUserRole(id, assignmentId, input, principal.userId);
  }
  public async deleteUserRole(
    id: string,
    assignmentId: string,
    principal: AuthPrincipal,
  ): Promise<Record<string, string>> {
    this.requirePermission(principal, 'identity.user_roles.manage');
    await this.repository.deleteUserRole(id, assignmentId, principal.userId);
    return { message: 'The role assignment has been removed.' };
  }

  public async requirePrincipal(authorization?: string): Promise<AuthPrincipal> {
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

  private async createIdentity(input: {
    email?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
    passwordHash?: string | null;
    status: string;
    input: Input;
    context: Input;
  }): Promise<AuthUser> {
    try {
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
  private async issueOtp(
    channel: string,
    destination: string,
    purpose: string,
  ): Promise<Record<string, unknown>> {
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
    return {
      accepted: true,
      challengeId,
      expiresAt,
      retryAfterSeconds: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS ?? 60),
      developmentOtp: process.env.OTP_DEV_EXPOSE_CODE === 'true' ? code : null,
    };
  }
  private async verifyOtp(
    id: string,
    code: string,
    purpose: string,
    channel: string,
    destination: string,
  ): Promise<void> {
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
    await this.repository.consumeOtp(
      id,
      attempts,
      false,
      !valid && attempts >= challenge.maxAttempts,
    );
    if (!valid) throw new OtpInvalidError();
    await this.repository.consumeOtp(id, attempts, true, false);
  }
  private async checkedPasswordHash(password: string, identity?: string): Promise<string> {
    validatePassword(password, identity);
    return argonHash(password);
  }
  private async issueTokens(
    user: AuthUser,
    context: Input,
    methods: string[],
  ): Promise<Record<string, unknown>> {
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
  private tokenResponse(
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
  private requirePermission(principal: AuthPrincipal, permission: string): void {
    if (!principal.permissions.includes(permission))
      throw new AuthorizationError('You do not have permission to perform this operation.');
  }
}

function normalizeEmail(value: string): string {
  const email = value?.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    throw new ValidationError('The email address is invalid.');
  return email;
}
function normalizePhone(country: string, number: string): [string, string] {
  const code = country?.trim().replaceAll(' ', '');
  const phone = number?.trim().replace(/[\s().-]+/g, '');
  if (!/^\+?[1-9][0-9]{0,2}$/.test(code ?? ''))
    throw new ValidationError('The phone country code is invalid.');
  const normalizedCode = code.startsWith('+') ? code : `+${code}`;
  if (!/^[0-9]{6,14}$/.test(phone ?? '') || phone.startsWith('+'))
    throw new ValidationError('The phone number is invalid.');
  return [normalizedCode, phone];
}
function validatePassword(password: string, identity?: string): void {
  const minimum = Number(process.env.PASSWORD_MIN_LENGTH ?? 8);
  if (
    !password ||
    password.length < minimum ||
    password.length > 128 ||
    password.trim() !== password ||
    password.includes('\0')
  )
    throw new ValidationError(`Password must contain at least ${minimum} characters.`);
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
