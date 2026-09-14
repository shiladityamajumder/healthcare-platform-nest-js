// * Linked with: @nestjs/common, ./create-organization.controller, ./create-organization.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateOrganizationController } from './create-organization.controller';
import { CreateOrganizationHandler } from './create-organization.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CreateOrganizationController],
  providers: [CreateOrganizationHandler],
})
export class CreateOrganizationModule {}
