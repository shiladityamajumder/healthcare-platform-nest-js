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
  ApiAuthOperation,
  ApiAuthResponse,
  ApiClientContextHeaders,
  ApiProtected,
  ApiValidationError,
} from '../../contracts/swagger';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class PasswordManagementController {
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
  set(
    @Body() body: SetPasswordSchema,
    @Headers('authorization') authorization?: string,
    @Headers() headers?: AuthRequestHeaders,
  ) {
    return this.service.set(body, authorization, headers ?? {});
  }
}
