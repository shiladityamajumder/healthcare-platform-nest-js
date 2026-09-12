/**
 * HTTP endpoints for email registration, phone registration, and email verification.
 * Used backward by Nest routing; connects forward to RegistrationService with validated DTOs.
 */
import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  EmailRegistrationSchema,
  EmailSchema,
  EmailVerifySchema,
  PhoneRegistrationVerifySchema,
} from './registration.schema';
import type { AuthRequestHeaders } from '../../contracts/auth-context';
import { PhoneSchema } from '../../contracts/phone.schema';
import { RegistrationService } from './registration.service';
import {
  ApiAuthBody,
  ApiAuthOperation,
  ApiAuthResponse,
  ApiClientContextHeaders,
  ApiValidationError,
} from '../../contracts/swagger';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class RegistrationController {
  public constructor(private readonly service: RegistrationService) {}

  @Post('register/email')
  @HttpCode(HttpStatus.CREATED)
  @ApiAuthOperation(
    'Register with email',
    'Creates a new account with an email address and password, and starts email verification when required.',
  )
  @ApiAuthBody(
    EmailRegistrationSchema,
    'New account identity, password, profile, and accepted policy versions.',
  )
  @ApiAuthResponse(
    'Account created.',
    {
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user@example.com',
        emailVerified: false,
      },
      verificationRequired: true,
      challengeId: '550e8400-e29b-41d4-a716-446655440000',
      expiresAt: '2026-01-01T00:05:00.000Z',
      developmentOtp: null,
      tokens: null,
    },
    HttpStatus.CREATED,
  )
  @ApiValidationError()
  @ApiClientContextHeaders()
  registerEmail(@Body() body: EmailRegistrationSchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.registerEmail(body, headers);
  }

  @Post('register/phone/request-otp')
  @ApiAuthOperation(
    'Request a phone registration OTP',
    'Starts a phone verification challenge before a phone account is created.',
  )
  @ApiAuthBody(PhoneSchema, 'Phone number to verify for registration.')
  @ApiAuthResponse(
    'OTP challenge created.',
    {
      accepted: true,
      challengeId: '550e8400-e29b-41d4-a716-446655440000',
      expiresAt: '2026-01-01T00:05:00.000Z',
      retryAfterSeconds: 60,
      developmentOtp: null,
    },
    201,
  )
  @ApiValidationError()
  requestPhoneOtp(@Body() body: PhoneSchema) {
    return this.service.requestPhoneOtp(body);
  }

  @Post('register/phone/verify-otp')
  @HttpCode(HttpStatus.CREATED)
  @ApiAuthOperation(
    'Complete phone registration',
    'Verifies the phone OTP and creates the account, returning tokens for the new user.',
  )
  @ApiAuthBody(
    PhoneRegistrationVerifySchema,
    'Phone challenge, OTP, optional password, profile, and accepted policy versions.',
  )
  @ApiAuthResponse(
    'Phone account created.',
    {
      accessToken: 'eyJhbGciOiJIUzI1NiIs...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
      tokenType: 'Bearer',
      accessExpiresAt: '2026-01-01T01:00:00.000Z',
      refreshExpiresAt: '2026-02-01T00:00:00.000Z',
      user: { id: '550e8400-e29b-41d4-a716-446655440000', phoneNumberMasked: '+91******10' },
    },
    HttpStatus.CREATED,
  )
  @ApiValidationError()
  @ApiClientContextHeaders()
  verifyPhone(@Body() body: PhoneRegistrationVerifySchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.verifyPhone(body, headers);
  }

  @Post('email-verification/request')
  @ApiAuthOperation(
    'Request email verification',
    'Starts a new email verification challenge for an existing account.',
  )
  @ApiAuthBody(EmailSchema, 'Email address whose verification should be requested.')
  @ApiAuthResponse(
    'Verification challenge created.',
    {
      accepted: true,
      challengeId: '550e8400-e29b-41d4-a716-446655440000',
      expiresAt: '2026-01-01T00:05:00.000Z',
      retryAfterSeconds: 60,
      developmentOtp: null,
    },
    201,
  )
  @ApiValidationError()
  requestEmailVerification(@Body() body: EmailSchema) {
    return this.service.requestEmailVerification(body);
  }

  @Post('email-verification/verify')
  @ApiAuthOperation(
    'Verify an email address',
    'Verifies the email challenge and returns tokens for the authenticated account.',
  )
  @ApiAuthBody(EmailVerifySchema, 'Email address, challenge ID, and six-digit verification code.')
  @ApiAuthResponse(
    'Email verified.',
    {
      accessToken: 'eyJhbGciOiJIUzI1NiIs...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
      tokenType: 'Bearer',
      accessExpiresAt: '2026-01-01T01:00:00.000Z',
      refreshExpiresAt: '2026-02-01T00:00:00.000Z',
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user@example.com',
        emailVerified: true,
      },
    },
    201,
  )
  @ApiValidationError()
  @ApiClientContextHeaders()
  verifyEmail(@Body() body: EmailVerifySchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.verifyEmail(body, headers);
  }
}
