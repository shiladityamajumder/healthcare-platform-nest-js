// * Auth module: Registers password-management controllers and providers.
// * File: src/features/password-management/password-management.module.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Password-management feature dependency-injection boundary.
 * Used backward by AuthModule; connects forward to its controller/service and auth infrastructure.
 */
import { Module } from '@nestjs/common';
import { AuthInfrastructureModule } from '../../infrastructure/auth-infrastructure.module';
import { PasswordManagementController } from './password-management.controller';
import { PasswordManagementService } from './password-management.service';

@Module({
  imports: [AuthInfrastructureModule],
  controllers: [PasswordManagementController],
  providers: [PasswordManagementService],
})
export class PasswordManagementModule {}
