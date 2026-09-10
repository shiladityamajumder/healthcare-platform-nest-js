// Linked with: @nestjs/common, ./api/http/v1/get-profile.controller, ./application/get-profile.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetProfileController } from './api/http/v1/get-profile.controller';
import { GetProfileHandler } from './application/get-profile.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetProfileController],
  providers: [GetProfileHandler],
})
export class GetProfileModule {}
