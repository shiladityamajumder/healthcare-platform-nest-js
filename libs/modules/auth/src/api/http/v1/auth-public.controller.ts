import { Controller, Get, Headers, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { NonTransactional } from '@platform/execution';
import { AuthApplicationService } from '../../../application/auth.application';
import {
  EmailDto,
  EmailRegistrationDto,
  EmailVerifyDto,
  ForgotPasswordDto,
  PasswordLoginDto,
  PhoneDto,
  PhoneLoginVerifyDto,
  PhoneRegistrationVerifyDto,
  RefreshTokenDto,
  ResetPasswordDto,
  ResetVerifyDto,
} from './dto/auth.dto';
import { authContext } from './auth-http.helpers';

@Controller({ path: 'auth', version: '1' })
export class AuthPublicController {
  public constructor(private readonly service: AuthApplicationService) {}
  @Get('capabilities') @NonTransactional() capabilities() {
    return this.service.capabilities();
  }
  @Get('.well-known/jwks.json') @NonTransactional() jwks() {
    return { keys: this.service.jwks() };
  }
  @Post('register/email') @HttpCode(HttpStatus.CREATED) registerEmail(
    @Body() body: EmailRegistrationDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.service.registerEmail(body, authContext(headers));
  }
  @Post('register/phone/request-otp') requestPhoneRegistration(@Body() body: PhoneDto) {
    return this.service.requestPhoneRegistrationOtp(body);
  }
  @Post('register/phone/verify-otp') @HttpCode(HttpStatus.CREATED) verifyPhoneRegistration(
    @Body() body: PhoneRegistrationVerifyDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.service.verifyPhoneRegistrationOtp(body, authContext(headers));
  }
  @Post('email-verification/request') requestEmailVerification(@Body() body: EmailDto) {
    return this.service.requestEmailVerificationOtp(body);
  }
  @Post('email-verification/verify') verifyEmail(
    @Body() body: EmailVerifyDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.service.verifyEmail(body, authContext(headers));
  }
  @Post('login/password') login(
    @Body() body: PasswordLoginDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.service.loginPassword(body, authContext(headers));
  }
  @Post('login/phone/request-otp') requestPhoneLogin(@Body() body: PhoneDto) {
    return this.service.requestPhoneLoginOtp(body);
  }
  @Post('login/phone/verify-otp') verifyPhoneLogin(
    @Body() body: PhoneLoginVerifyDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.service.verifyPhoneLoginOtp(body, authContext(headers));
  }
  @Post('token/refresh') refresh(
    @Body() body: RefreshTokenDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.service.refresh(body, authContext(headers));
  }
  @Post('logout') logout(@Body() body: RefreshTokenDto) {
    return this.service.logout(body);
  }
  @Post('password/forgot') forgot(@Body() body: ForgotPasswordDto) {
    return this.service.forgotPassword(body);
  }
  @Post('password/reset/verify-otp') verifyReset(@Body() body: ResetVerifyDto) {
    return this.service.verifyResetOtp(body);
  }
  @Post('password/reset') reset(
    @Body() body: ResetPasswordDto,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.service.resetPassword(body, authContext(headers));
  }
}
