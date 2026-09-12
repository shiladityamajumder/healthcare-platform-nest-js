/**
 * HTTP endpoints for password and phone-OTP login.
 * Used backward by Nest routing; connects forward to LoginService with validated request DTOs.
 */
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PasswordLoginSchema, PhoneLoginVerifySchema } from './login.schema';
import type { AuthRequestHeaders } from '../../contracts/auth-context';
import { PhoneSchema } from '../../contracts/phone.schema';
import { LoginService } from './login.service';
import {
  ApiAuthBody,
  ApiAuthOperation,
  ApiAuthResponse,
  ApiClientContextHeaders,
  ApiValidationError,
} from '../../contracts/swagger';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class LoginController {
  public constructor(private readonly service: LoginService) {}

  @Post('login/password')
  @ApiAuthOperation(
    'Log in with a password',
    'Authenticates an email or phone identity and returns an access token plus a rotating refresh token.',
  )
  @ApiAuthBody(
    PasswordLoginSchema,
    'Identity channel and password used to authenticate the account.',
  )
  @ApiAuthResponse(
    'Authentication succeeded.',
    {
      accessToken: 'eyJhbGciOiJIUzI1NiIs...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
      tokenType: 'Bearer',
      accessExpiresAt: '2026-01-01T01:00:00.000Z',
      refreshExpiresAt: '2026-02-01T00:00:00.000Z',
      user: { id: '550e8400-e29b-41d4-a716-446655440000', email: 'user@example.com' },
    },
    201,
  )
  @ApiValidationError()
  @ApiClientContextHeaders()
  loginPassword(@Body() body: PasswordLoginSchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.loginPassword(body, headers);
  }

  @Post('login/phone/request-otp')
  @ApiAuthOperation(
    'Request a phone login OTP',
    'Starts a phone login challenge. In development, the OTP may be returned according to the configured environment.',
  )
  @ApiAuthBody(PhoneSchema, 'Phone number that owns the account.')
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

  @Post('login/phone/verify-otp')
  @ApiAuthOperation(
    'Verify a phone login OTP',
    'Verifies the login challenge and returns access and refresh tokens when the code is valid.',
  )
  @ApiAuthBody(PhoneLoginVerifySchema, 'Phone number, challenge ID, and six-digit OTP.')
  @ApiAuthResponse(
    'Phone authentication succeeded.',
    {
      accessToken: 'eyJhbGciOiJIUzI1NiIs...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
      tokenType: 'Bearer',
      accessExpiresAt: '2026-01-01T01:00:00.000Z',
      refreshExpiresAt: '2026-02-01T00:00:00.000Z',
      user: { id: '550e8400-e29b-41d4-a716-446655440000', phoneNumberMasked: '+91******10' },
    },
    201,
  )
  @ApiValidationError()
  @ApiClientContextHeaders()
  verifyPhone(@Body() body: PhoneLoginVerifySchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.verifyPhone(body, headers);
  }
}
