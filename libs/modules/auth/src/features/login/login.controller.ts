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

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class LoginController {
  public constructor(private readonly service: LoginService) {}

  @Post('login/password')
  loginPassword(@Body() body: PasswordLoginSchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.loginPassword(body, headers);
  }

  @Post('login/phone/request-otp')
  requestPhoneOtp(@Body() body: PhoneSchema) {
    return this.service.requestPhoneOtp(body);
  }

  @Post('login/phone/verify-otp')
  verifyPhone(@Body() body: PhoneLoginVerifySchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.verifyPhone(body, headers);
  }
}
