// * Linked with: @nestjs/common, ./update-organization.controller, ./update-organization.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { UpdateOrganizationController } from './update-organization.controller';
import { UpdateOrganizationHandler } from './update-organization.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [UpdateOrganizationController],
  providers: [UpdateOrganizationHandler],
})
export class UpdateOrganizationModule {}
