// * Linked with: @nestjs/common, ./create-profile.controller, ./create-profile.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateProfileController } from './create-profile.controller';
import { CreateProfileHandler } from './create-profile.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CreateProfileController],
  providers: [CreateProfileHandler],
})
export class CreateProfileModule {}
