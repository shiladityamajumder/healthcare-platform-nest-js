// * Auth module: Exposes password recovery, reset, change, and setup endpoints.
// * File: src/features/password-management/password-management.controller.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * HTTP endpoints for password recovery, reset, change, and initial password setup.
 * Used backward by Nest routing; connects forward to PasswordManagementService.
 */
import { Body, Controller, Headers, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ResetVerifySchema,
  SetPasswordSchema,
} from './password-management.schema';
import type { AuthRequestHeaders } from '../../contracts/auth-context';
import { PasswordManagementService } from './password-management.service';
import {
  ApiAuthBody,
  ApiAuthErrors,
  ApiAuthOperation,
  ApiAuthResponse,
  ApiClientContextHeaders,
  ApiProtected,
  ApiValidationError,
} from '../../contracts/swagger';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
@ApiAuthErrors({
  unauthorized:
    'The account, password, OTP, reset token, or bearer token was not accepted. Do not reveal whether an account exists; guide the user to retry the recovery flow.',
  conflict:
    'The account already has a password, or the requested password operation conflicts with the current account state.',
  unavailable:
    'The authentication database or OTP infrastructure is temporarily unavailable. Retry later and retain the request ID for support.',
})
export class PasswordManagementController {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(private readonly service: PasswordManagementService) {}

  @Post('password/forgot')
  @ApiAuthOperation(
    'Start password recovery',
    'Creates an email or SMS password-recovery challenge without revealing whether an account exists.',
  )
  @ApiAuthBody(ForgotPasswordSchema, 'Recovery channel and corresponding email or phone identity.')
  @ApiAuthResponse(
    'Recovery challenge accepted.',
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
  /**
   * Starts password recovery through email or SMS. Always show a neutral confirmation to the
   * user because the API intentionally does not disclose whether the identity exists.
   */
  forgot(@Body() body: ForgotPasswordSchema) {
    return this.service.forgot(body);
  }

  @Post('password/reset/verify-otp')
  @ApiAuthOperation(
    'Verify password recovery OTP',
    'Validates the recovery code and returns a short-lived reset token for setting a new password.',
  )
  @ApiAuthBody(ResetVerifySchema, 'Recovery identity, challenge ID, and six-digit code.')
  @ApiAuthResponse(
    'Recovery code verified.',
    { resetToken: 'eyJhbGciOiJIUzI1NiIs...', expiresAt: '2026-01-01T00:15:00.000Z' },
    201,
  )
  @ApiValidationError()
  /**
   * Verifies the recovery OTP and returns a short-lived reset token. Keep this token transient and
   * send it only to the password-reset endpoint; it is not an access token.
   */
  verifyReset(@Body() body: ResetVerifySchema) {
    return this.service.verifyReset(body);
  }

  @Post('password/reset')
  @ApiAuthOperation(
    'Reset a password',
    'Consumes a reset token and replaces the account password, revoking existing sessions.',
  )
  @ApiAuthBody(ResetPasswordSchema, 'Short-lived reset token and the replacement password.')
  @ApiAuthResponse(
    'Password reset completed.',
    {
      accessToken: 'eyJhbGciOiJIUzI1NiIs...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
      tokenType: 'Bearer',
      accessExpiresAt: '2026-01-01T01:00:00.000Z',
      refreshExpiresAt: '2026-02-01T00:00:00.000Z',
      user: { id: '550e8400-e29b-41d4-a716-446655440000' },
    },
    201,
  )
  @ApiValidationError()
  @ApiClientContextHeaders()
  /**
   * Replaces the password using the short-lived reset token, revokes previous sessions, and
   * returns a new session. Replace any stored credentials and tokens with the returned pair.
   */
  reset(@Body() body: ResetPasswordSchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.reset(body, headers);
  }

  @Put('password')
  @ApiProtected()
  @ApiAuthOperation(
    'Change the current password',
    'Requires the current access token and password, then revokes other sessions after a successful change.',
  )
  @ApiAuthBody(ChangePasswordSchema, 'Current password and replacement password.')
  @ApiAuthResponse('Password changed.', {
    accessToken: 'eyJhbGciOiJIUzI1NiIs...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
    tokenType: 'Bearer',
    accessExpiresAt: '2026-01-01T01:00:00.000Z',
    refreshExpiresAt: '2026-02-01T00:00:00.000Z',
    user: { id: '550e8400-e29b-41d4-a716-446655440000' },
  })
  @ApiValidationError()
  @ApiClientContextHeaders()
  /**
   * Changes the password for an authenticated user. The current password is required and other
   * sessions are revoked after success, so the frontend should refresh its stored token pair.
   */
  change(
    @Body() body: ChangePasswordSchema,
    @Headers('authorization') authorization?: string,
    @Headers() headers?: AuthRequestHeaders,
  ) {
    return this.service.change(body, authorization, headers ?? {});
  }

  @Post('password')
  @ApiProtected()
  @ApiAuthOperation(
    'Set an initial password',
    'Requires an access token for an account that does not yet have a password.',
  )
  @ApiAuthBody(SetPasswordSchema, 'Password to configure for the authenticated account.')
  @ApiAuthResponse(
    'Password configured.',
    {
      accessToken: 'eyJhbGciOiJIUzI1NiIs...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
      tokenType: 'Bearer',
      accessExpiresAt: '2026-01-01T01:00:00.000Z',
      refreshExpiresAt: '2026-02-01T00:00:00.000Z',
      user: { id: '550e8400-e29b-41d4-a716-446655440000' },
    },
    201,
  )
  @ApiValidationError()
  @ApiClientContextHeaders()
  /**
   * Sets the first password for an authenticated account that does not have one, such as an
   * account created through phone OTP. It cannot overwrite an existing password.
   */
  set(
    @Body() body: SetPasswordSchema,
    @Headers('authorization') authorization?: string,
    @Headers() headers?: AuthRequestHeaders,
  ) {
    return this.service.set(body, authorization, headers ?? {});
  }
}
