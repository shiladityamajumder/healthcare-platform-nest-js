// Linked with: @nestjs/common, ./api/http/v1/refresh-token.controller, ./application/refresh-token.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { RefreshTokenController } from './api/http/v1/refresh-token.controller';
import { RefreshTokenHandler } from './application/refresh-token.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [RefreshTokenController],
  providers: [RefreshTokenHandler],
})
export class RefreshTokenModule {}
