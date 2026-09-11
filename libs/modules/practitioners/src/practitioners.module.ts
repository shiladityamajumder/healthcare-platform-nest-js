// * Linked with: @nestjs/common, ./features/create-profile/create-profile.module, ./features/get-profile/get-profile.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreateProfileModule } from './features/create-profile/create-profile.module';
import { GetProfileModule } from './features/get-profile/get-profile.module';
import { UpdateProfileModule } from './features/update-profile/update-profile.module';
import { LicensesModule } from './features/licenses/licenses.module';

/** Composition root for the Practitioners bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [CreateProfileModule, GetProfileModule, UpdateProfileModule, LicensesModule],
  exports: [],
})
export class PractitionersModule {}
