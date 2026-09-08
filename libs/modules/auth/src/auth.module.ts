import { Module } from '@nestjs/common';
import { RegistrationModule } from './features/registration/registration.module';
import { LoginModule } from './features/login/login.module';
import { LogoutModule } from './features/logout/logout.module';
import { RefreshTokenModule } from './features/refresh-token/refresh-token.module';
import { ForgotPasswordModule } from './features/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './features/reset-password/reset-password.module';
import { ChangePasswordModule } from './features/change-password/change-password.module';
import { VerifyEmailModule } from './features/verify-email/verify-email.module';
import { MfaModule } from './features/mfa/mfa.module';

/** Composition root for the Auth bounded context. */
@Module({
  imports: [
    RegistrationModule,
    LoginModule,
    LogoutModule,
    RefreshTokenModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    ChangePasswordModule,
    VerifyEmailModule,
    MfaModule
  ],
  exports: [],
})
export class AuthModule {}
