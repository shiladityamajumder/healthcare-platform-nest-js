// Linked with: @nestjs/common, ./features/create-organization/create-organization.module, ./features/get-organization/get-organization.module.
// Used by: the application module or feature root during NestJS startup.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateOrganizationModule } from './features/create-organization/create-organization.module';
import { GetOrganizationModule } from './features/get-organization/get-organization.module';
import { UpdateOrganizationModule } from './features/update-organization/update-organization.module';
import { FacilitiesModule } from './features/facilities/facilities.module';

/** Composition root for the Organizations bounded context. */
// Register the feature components and their dependencies with NestJS.
@Module({
  imports: [
    CreateOrganizationModule,
    GetOrganizationModule,
    UpdateOrganizationModule,
    FacilitiesModule,
  ],
  exports: [],
})
export class OrganizationsModule {}
