// * Linked with: @nestjs/common, ./api/http/v1/mfa.controller, ./application/mfa.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { MfaController } from './api/http/v1/mfa.controller';
import { MfaHandler } from './application/mfa.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [MfaController],
  providers: [MfaHandler],
})
export class MfaModule {}
