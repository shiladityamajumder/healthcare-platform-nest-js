// * Auth module: Composes the authentication bounded context and its feature modules.
// * File: src/auth.module.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Auth bounded-context composition root.
 * Used backward by the API AppModule; connects forward to every auth feature module.
 */
import { Module } from '@nestjs/common';
import { AdministrationModule } from './features/administration/administration.module';
import { CapabilitiesModule } from './features/capabilities/capabilities.module';
import { CurrentUserModule } from './features/current-user/current-user.module';
import { LoginModule } from './features/login/login.module';
import { PasswordManagementModule } from './features/password-management/password-management.module';
import { RegistrationModule } from './features/registration/registration.module';
import { SessionManagementModule } from './features/session-management/session-management.module';

/** Registers the feature modules without exposing their implementation details. */
@Module({
  imports: [
    CapabilitiesModule,
    RegistrationModule,
    LoginModule,
    SessionManagementModule,
    PasswordManagementModule,
    CurrentUserModule,
    AdministrationModule,
  ],
  exports: [],
})
export class AuthModule {}
