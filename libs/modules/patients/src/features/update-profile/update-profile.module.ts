// Linked with: @nestjs/common, ./api/http/v1/update-profile.controller, ./application/update-profile.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { UpdateProfileController } from './api/http/v1/update-profile.controller';
import { UpdateProfileHandler } from './application/update-profile.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [UpdateProfileController],
  providers: [UpdateProfileHandler],
})
export class UpdateProfileModule {}
