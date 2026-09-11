// * Linked with: @nestjs/common, ./features/create-prescription/create-prescription.module, ./features/get-prescription/get-prescription.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CreatePrescriptionModule } from './features/create-prescription/create-prescription.module';
import { GetPrescriptionModule } from './features/get-prescription/get-prescription.module';
import { ReviewPrescriptionModule } from './features/review-prescription/review-prescription.module';
import { AttachDocumentModule } from './features/attach-document/attach-document.module';

/** Composition root for the Prescriptions bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [
    CreatePrescriptionModule,
    GetPrescriptionModule,
    ReviewPrescriptionModule,
    AttachDocumentModule,
  ],
  exports: [],
})
export class PrescriptionsModule {}
