// * Auth module: Registers administration controllers and application providers.
// * File: src/features/administration/administration.module.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Administration feature composition and dependency-injection boundary.
 * Used backward by AuthModule; connects forward to its controller, service, and auth infrastructure.
 */
import { Module } from '@nestjs/common';
import { AuthInfrastructureModule } from '../../infrastructure/auth-infrastructure.module';
import {
  AdminPermissionsController,
  AdminRolesController,
  AdminUsersController,
} from './administration.controller';
import { AdministrationService } from './administration.service';

/** Registers administration routes and their business service. */
@Module({
  imports: [AuthInfrastructureModule],
  controllers: [AdminUsersController, AdminRolesController, AdminPermissionsController],
  providers: [AdministrationService],
})
export class AdministrationModule {}
