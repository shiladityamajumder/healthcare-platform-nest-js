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

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class PasswordManagementController {
  public constructor(private readonly service: PasswordManagementService) {}

  @Post('password/forgot')
  forgot(@Body() body: ForgotPasswordSchema) {
    return this.service.forgot(body);
  }

  @Post('password/reset/verify-otp')
  verifyReset(@Body() body: ResetVerifySchema) {
    return this.service.verifyReset(body);
  }

  @Post('password/reset')
  reset(@Body() body: ResetPasswordSchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.reset(body, headers);
  }

  @Put('password')
  change(
    @Body() body: ChangePasswordSchema,
    @Headers('authorization') authorization?: string,
    @Headers() headers?: AuthRequestHeaders,
  ) {
    return this.service.change(body, authorization, headers ?? {});
  }

  @Post('password')
  set(
    @Body() body: SetPasswordSchema,
    @Headers('authorization') authorization?: string,
    @Headers() headers?: AuthRequestHeaders,
  ) {
    return this.service.set(body, authorization, headers ?? {});
  }
}
