// * Linked with: @nestjs/common, ./features/create-profile/create-profile.module, ./features/get-profile/get-profile.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateProfileModule } from './features/create-profile/create-profile.module';
import { GetProfileModule } from './features/get-profile/get-profile.module';
import { UpdateProfileModule } from './features/update-profile/update-profile.module';
import { AddressesModule } from './features/addresses/addresses.module';
import { ConsentsModule } from './features/consents/consents.module';

/** Composition root for the Patients bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [
    CreateProfileModule,
    GetProfileModule,
    UpdateProfileModule,
    AddressesModule,
    ConsentsModule,
  ],
  exports: [],
})
export class PatientsModule {}
