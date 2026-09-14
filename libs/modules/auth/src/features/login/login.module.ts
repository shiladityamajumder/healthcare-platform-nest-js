// * Auth module: Registers the login controller and service.
// * File: src/features/login/login.module.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Login feature composition and dependency-injection boundary.
 * Used backward by AuthModule; connects forward to LoginController, LoginService, and auth infrastructure.
 */
import { Module } from '@nestjs/common';
import { AuthInfrastructureModule } from '../../infrastructure/auth-infrastructure.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [AuthInfrastructureModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
