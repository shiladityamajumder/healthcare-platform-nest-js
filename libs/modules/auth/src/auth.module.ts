// * Linked with: @nestjs/common, ./features/registration/registration.module, ./features/login/login.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { AuthHttpModule } from './auth-http.module';

/** Composition root for the Auth bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [AuthHttpModule],
  exports: [],
})
export class AuthModule {}
