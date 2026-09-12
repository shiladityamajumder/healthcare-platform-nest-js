/**
 * Authenticates users with passwords or phone OTPs and issues sessions/tokens.
 * Used backward by LoginController; connects forward to identity persistence and workflow orchestration.
 */
import { Injectable } from '@nestjs/common';
import { AuthenticationError, InvalidCredentialsError } from '@shared/errors';
import { verify as argonVerify } from 'argon2';
import { AuthWorkflowService } from '../../application/workflow/auth-workflow.service';
import { authContext, toAuthInput, type AuthRequestHeaders } from '../../contracts/auth-context';
import { normalizeEmail, normalizePhone } from '../identity/identity.validation';
import { IdentityRepository } from '../registration/identity.repository';

type AuthInput = object;

@Injectable()
export class LoginService {
  public constructor(
    private readonly workflow: AuthWorkflowService,
    private readonly identity: IdentityRepository,
  ) {}

  async loginPassword(input: AuthInput, headers: AuthRequestHeaders) {
    const values = toAuthInput(input);
    // Normalize the selected identity before querying so email/phone lookups are consistent.
    const identity =
      values.channel === 'email'
        ? { email: normalizeEmail(String(values.email)) }
        : (() => {
            const phone = normalizePhone(
              String(values.phoneCountryCode),
              String(values.phoneNumber),
            );
            return { phoneCountryCode: phone[0], phoneNumber: phone[1] };
          })();
    const user = await this.identity.findUserForLogin(identity);
    if (
      !user ||
      !user.passwordHash ||
      !(await argonVerify(user.passwordHash, String(values.password)))
    )
      throw new InvalidCredentialsError();
    if (user.status !== 'active') throw new AuthenticationError('The account is not available.');
    if (user.lockedUntil && user.lockedUntil > new Date())
      throw new AuthenticationError('The account is temporarily locked.');
    const updated = await this.identity.updateUser(user.id, {
      last_login_at: new Date(),
      failed_login_count: 0,
      locked_until: null,
    });
    return this.workflow.issueTokens(updated, authContext(headers), ['password']);
  }

  requestPhoneOtp(input: AuthInput) {
    const values = toAuthInput(input);
    const phone = normalizePhone(String(values.phoneCountryCode), String(values.phoneNumber));
    return this.workflow.issueOtp('sms', phone.join(''), 'login_phone');
  }

  async verifyPhone(input: AuthInput, headers: AuthRequestHeaders) {
    const values = toAuthInput(input);
    const phone = normalizePhone(String(values.phoneCountryCode), String(values.phoneNumber));
    // OTP verification consumes the challenge before issuing a session.
    await this.workflow.verifyOtp(
      String(values.challengeId),
      String(values.code),
      'login_phone',
      'sms',
      phone.join(''),
    );
    const user = await this.identity.findUserByPhone(...phone);
    if (!user || user.status !== 'active' || !user.phoneVerified)
      throw new InvalidCredentialsError();
    return this.workflow.issueTokens(user, authContext(headers), ['otp']);
  }
}
