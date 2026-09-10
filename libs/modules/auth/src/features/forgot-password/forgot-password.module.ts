// Linked with: @nestjs/common, ./api/http/v1/forgot-password.controller, ./application/forgot-password.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ForgotPasswordController } from './api/http/v1/forgot-password.controller';
import { ForgotPasswordHandler } from './application/forgot-password.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordHandler],
})
export class ForgotPasswordModule {}
