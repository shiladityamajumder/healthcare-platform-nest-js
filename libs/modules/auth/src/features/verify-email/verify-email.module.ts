// * Linked with: @nestjs/common, ./api/http/v1/verify-email.controller, ./application/verify-email.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { VerifyEmailController } from './api/http/v1/verify-email.controller';
import { VerifyEmailHandler } from './application/verify-email.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [VerifyEmailController],
  providers: [VerifyEmailHandler],
})
export class VerifyEmailModule {}
