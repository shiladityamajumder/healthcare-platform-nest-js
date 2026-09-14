// * Auth module: Implements registration and identity-verification use cases.
// * File: src/features/registration/registration.service.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Creates identities, issues registration OTPs, and verifies email/phone ownership.
 * Used backward by RegistrationController; connects forward to identity persistence and workflow orchestration.
 * Identity creation and role assignment are atomic inside the global operation transaction.
 */
import { Injectable } from '@nestjs/common';
import { ConflictError, AuthenticationError } from '@shared/errors';
import { AuthWorkflowService } from '../../application/workflow/auth-workflow.service';
import { authContext, toAuthInput, type AuthRequestHeaders } from '../../contracts/auth-context';
import { normalizeEmail, normalizePhone } from '../identity/identity.validation';
import { IdentityRepository } from './identity.repository';

type AuthInput = object;

@Injectable()
export class RegistrationService {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(
    private readonly workflow: AuthWorkflowService,
    private readonly identity: IdentityRepository,
  ) {}

  // * Function [registerEmail]: Creates or issues the requested authentication resource.
  async registerEmail(input: AuthInput, headers: AuthRequestHeaders) {
    const values = toAuthInput(input);
    const email = normalizeEmail(String(values.email));
    // Create the pending identity first; the verification challenge is part of the same transaction.
    const verificationRequired = process.env.EMAIL_VERIFICATION_REQUIRED !== 'false';
    if (await this.identity.findUserByEmail(email))
      throw new ConflictError('The identity is already registered.', { field: 'email' });
    const passwordHash = await this.workflow.hashPassword(values.password as string, email);
    const user = await this.workflow.createIdentity({
      email,
      passwordHash,
      status: verificationRequired ? 'pending' : 'active',
      input: values,
    });
    if (!verificationRequired)
      return {
        user,
        verificationRequired: false,
        challengeId: null,
        expiresAt: null,
        developmentOtp: null,
        tokens: await this.workflow.issueTokens(user, authContext(headers), ['password']),
      };
    const challenge = await this.workflow.issueOtp('email', email, 'verify_email');
    return {
      user,
      verificationRequired: true,
      challengeId: challenge.challengeId,
      expiresAt: challenge.expiresAt,
      developmentOtp: challenge.developmentOtp,
      tokens: null,
    };
  }

  // * Function [requestPhoneOtp]: Creates or issues the requested authentication resource.
  requestPhoneOtp(input: AuthInput) {
    const values = toAuthInput(input);
    const phone = normalizePhone(String(values.phoneCountryCode), String(values.phoneNumber));
    return this.identity.findUserByPhone(...phone).then((user) => {
      if (user) throw new ConflictError('The identity is already registered.');
      return this.workflow.issueOtp('sms', phone.join(''), 'registration_phone');
    });
  }

  // * Function [verifyPhone]: Validates the supplied authentication data and rejects unsafe input.
  async verifyPhone(input: AuthInput, headers: AuthRequestHeaders) {
    const values = toAuthInput(input);
    const phone = normalizePhone(String(values.phoneCountryCode), String(values.phoneNumber));
    // A valid phone challenge is single-use, then identity creation and session issuance follow.
    await this.workflow.verifyOtp(
      String(values.challengeId),
      String(values.code),
      'registration_phone',
      'sms',
      phone.join(''),
    );
    if (await this.identity.findUserByPhone(...phone))
      throw new ConflictError('The identity is already registered.');
    const passwordHash = values.password
      ? await this.workflow.hashPassword(values.password as string, phone[1])
      : null;
    const user = await this.workflow.createIdentity({
      phoneCountryCode: phone[0],
      phoneNumber: phone[1],
      passwordHash,
      status: 'active',
      input: values,
    });
    return this.workflow.issueTokens(
      user,
      authContext(headers),
      passwordHash ? ['otp', 'password'] : ['otp'],
    );
  }

  // * Function [requestEmailVerification]: Creates or issues the requested authentication resource.
  requestEmailVerification(input: AuthInput) {
    const values = toAuthInput(input);
    return this.workflow.issueOtp('email', normalizeEmail(String(values.email)), 'verify_email');
  }

  // * Function [verifyEmail]: Validates the supplied authentication data and rejects unsafe input.
  async verifyEmail(input: AuthInput, headers: AuthRequestHeaders) {
    const values = toAuthInput(input);
    const email = normalizeEmail(String(values.email));
    // Activate the account only after the email challenge has been consumed successfully.
    await this.workflow.verifyOtp(
      String(values.challengeId),
      String(values.code),
      'verify_email',
      'email',
      email,
    );
    const user = await this.identity.findUserByEmail(email);
    if (!user) throw new AuthenticationError('The verification request could not be completed.');
    const updated = await this.identity.updateUser(user.id, {
      status: 'active',
      email_verified_at: new Date(),
    });
    return this.workflow.issueTokens(updated, authContext(headers), ['email_verification']);
  }
}
