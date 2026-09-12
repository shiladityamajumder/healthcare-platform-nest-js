/**
 * Registers auth database adapters, token signing, and application workflow providers.
 * Used backward by each auth feature module; connects forward through DI to PostgresDatabase and feature repositories.
 */
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@platform/database';
import { AdministrationRepository } from '../features/administration/administration.repository';
import { IdentityRepository } from '../features/registration/identity.repository';
import { OtpRepository } from '../features/registration/otp.repository';
import { SessionRepository } from '../features/session-management/session.repository';
import { AUTH_REPOSITORY, AUTH_TOKEN_SERVICE } from '../contracts/auth.ports';
import { AuthWorkflowService } from '../application/workflow/auth-workflow.service';
import { AuthPostgresRepository } from './persistence/auth.repository';
import { AuthTokenService } from './token/auth-token.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    IdentityRepository,
    OtpRepository,
    SessionRepository,
    AdministrationRepository,
    AuthPostgresRepository,
    AuthTokenService,
    AuthWorkflowService,
    { provide: AUTH_REPOSITORY, useExisting: AuthPostgresRepository },
    { provide: AUTH_TOKEN_SERVICE, useExisting: AuthTokenService },
  ],
  exports: [
    AdministrationRepository,
    IdentityRepository,
    OtpRepository,
    SessionRepository,
    AuthPostgresRepository,
    AuthTokenService,
    AuthWorkflowService,
  ],
})
export class AuthInfrastructureModule {}
