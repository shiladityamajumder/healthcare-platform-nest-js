// * Linked with: @nestjs/common, ./api/http/v1/facilities.controller, ./application/facilities.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { FacilitiesController } from './api/http/v1/facilities.controller';
import { FacilitiesHandler } from './application/facilities.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [FacilitiesController],
  providers: [FacilitiesHandler],
})
export class FacilitiesModule {}
