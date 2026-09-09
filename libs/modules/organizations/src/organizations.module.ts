import { Module } from '@nestjs/common';
import { CreateOrganizationModule } from './features/create-organization/create-organization.module';
import { GetOrganizationModule } from './features/get-organization/get-organization.module';
import { UpdateOrganizationModule } from './features/update-organization/update-organization.module';
import { FacilitiesModule } from './features/facilities/facilities.module';

/** Composition root for the Organizations bounded context. */
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
