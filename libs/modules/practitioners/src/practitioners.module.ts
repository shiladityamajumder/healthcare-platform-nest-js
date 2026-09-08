import { Module } from '@nestjs/common';
import { CreateProfileModule } from './features/create-profile/create-profile.module';
import { GetProfileModule } from './features/get-profile/get-profile.module';
import { UpdateProfileModule } from './features/update-profile/update-profile.module';
import { LicensesModule } from './features/licenses/licenses.module';

/** Composition root for the Practitioners bounded context. */
@Module({
  imports: [
    CreateProfileModule,
    GetProfileModule,
    UpdateProfileModule,
    LicensesModule
  ],
  exports: [],
})
export class PractitionersModule {}
