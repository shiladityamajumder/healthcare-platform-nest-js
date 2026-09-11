// * Linked with: @nestjs/common, ./api/http/v1/reset-password.controller, ./application/reset-password.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ResetPasswordController } from './api/http/v1/reset-password.controller';
import { ResetPasswordHandler } from './application/reset-password.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ResetPasswordController],
  providers: [ResetPasswordHandler],
})
export class ResetPasswordModule {}
