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

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class RegistrationController {
  public constructor(private readonly service: RegistrationService) {}

  @Post('register/email')
  @HttpCode(HttpStatus.CREATED)
  registerEmail(@Body() body: EmailRegistrationSchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.registerEmail(body, headers);
  }

  @Post('register/phone/request-otp')
  requestPhoneOtp(@Body() body: PhoneSchema) {
    return this.service.requestPhoneOtp(body);
  }

  @Post('register/phone/verify-otp')
  @HttpCode(HttpStatus.CREATED)
  verifyPhone(@Body() body: PhoneRegistrationVerifySchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.verifyPhone(body, headers);
  }

  @Post('email-verification/request')
  requestEmailVerification(@Body() body: EmailSchema) {
    return this.service.requestEmailVerification(body);
  }

  @Post('email-verification/verify')
  verifyEmail(@Body() body: EmailVerifySchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.verifyEmail(body, headers);
  }
}
