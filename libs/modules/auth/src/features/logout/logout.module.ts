// Linked with: @nestjs/common, ./api/http/v1/logout.controller, ./application/logout.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { LogoutController } from './api/http/v1/logout.controller';
import { LogoutHandler } from './application/logout.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [LogoutController],
  providers: [LogoutHandler],
})
export class LogoutModule {}
