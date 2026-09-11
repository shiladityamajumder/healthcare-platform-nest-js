// * Linked with: @nestjs/common, ./api/http/v1/change-password.controller, ./application/change-password.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ChangePasswordController } from './api/http/v1/change-password.controller';
import { ChangePasswordHandler } from './application/change-password.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ChangePasswordController],
  providers: [ChangePasswordHandler],
})
export class ChangePasswordModule {}
