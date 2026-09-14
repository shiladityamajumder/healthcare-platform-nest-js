// * Linked with: @nestjs/common, ./get-organization.controller, ./get-organization.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetOrganizationController } from './get-organization.controller';
import { GetOrganizationHandler } from './get-organization.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetOrganizationController],
  providers: [GetOrganizationHandler],
})
export class GetOrganizationModule {}
