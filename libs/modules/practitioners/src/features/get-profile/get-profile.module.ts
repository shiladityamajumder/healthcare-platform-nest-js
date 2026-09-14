// * Linked with: @nestjs/common, ./get-profile.controller, ./get-profile.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetProfileController } from './get-profile.controller';
import { GetProfileHandler } from './get-profile.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetProfileController],
  providers: [GetProfileHandler],
})
export class GetProfileModule {}
