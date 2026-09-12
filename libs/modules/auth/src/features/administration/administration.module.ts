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
