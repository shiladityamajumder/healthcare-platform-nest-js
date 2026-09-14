// * Linked with: @nestjs/common, ./facilities.controller, ./facilities.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesHandler } from './facilities.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesHandler],
})
export class FacilitiesModule {}
