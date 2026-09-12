import { Module } from '@nestjs/common';
import { AuthApplicationService } from './application/auth.application';
import { AUTH_REPOSITORY, AUTH_TOKEN_SERVICE } from './domain/ports/auth.ports';
import { AuthPostgresRepository } from './infrastructure/persistence/postgres/repositories/auth.repository';
import { AuthTokenService } from './infrastructure/token.service';
import {
  AdminUsersController,
  AdminPermissionsController,
  AdminRolesController,
} from './api/http/v1/auth-admin.controller';
import { AuthPublicController } from './api/http/v1/auth-public.controller';
import {
  AuthSessionController,
  CurrentAuthorizationController,
  CurrentUserController,
} from './api/http/v1/auth-session.controller';

@Module({
  controllers: [
    AuthPublicController,
    AuthSessionController,
    CurrentAuthorizationController,
    CurrentUserController,
    AdminUsersController,
    AdminRolesController,
    AdminPermissionsController,
  ],
  providers: [
    AuthApplicationService,
    AuthPostgresRepository,
    AuthTokenService,
    { provide: AUTH_REPOSITORY, useExisting: AuthPostgresRepository },
    { provide: AUTH_TOKEN_SERVICE, useExisting: AuthTokenService },
  ],
})
export class AuthHttpModule {}
