import { Module } from '@nestjs/common';
import { CreateProfileModule } from './features/create-profile/create-profile.module';
import { GetProfileModule } from './features/get-profile/get-profile.module';
import { UpdateProfileModule } from './features/update-profile/update-profile.module';
import { AddressesModule } from './features/addresses/addresses.module';
import { ConsentsModule } from './features/consents/consents.module';

/** Composition root for the Patients bounded context. */
@Module({
  imports: [
    CreateProfileModule,
    GetProfileModule,
    UpdateProfileModule,
    AddressesModule,
    ConsentsModule
  ],
  exports: [],
})
export class PatientsModule {}
