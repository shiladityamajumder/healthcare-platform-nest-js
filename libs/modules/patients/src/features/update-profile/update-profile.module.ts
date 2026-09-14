// * Linked with: @nestjs/common, ./update-profile.controller, ./update-profile.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { UpdateProfileController } from './update-profile.controller';
import { UpdateProfileHandler } from './update-profile.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [UpdateProfileController],
  providers: [UpdateProfileHandler],
})
export class UpdateProfileModule {}
