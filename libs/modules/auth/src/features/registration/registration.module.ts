// Linked with: @nestjs/common, ./api/http/v1/registration.controller, ./application/registration.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { RegistrationController } from './api/http/v1/registration.controller';
import { RegistrationHandler } from './application/registration.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [RegistrationController],
  providers: [RegistrationHandler],
})
export class RegistrationModule {}
