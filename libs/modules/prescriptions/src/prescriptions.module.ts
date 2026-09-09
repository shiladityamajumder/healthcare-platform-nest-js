import { Module } from '@nestjs/common';
import { CreatePrescriptionModule } from './features/create-prescription/create-prescription.module';
import { GetPrescriptionModule } from './features/get-prescription/get-prescription.module';
import { ReviewPrescriptionModule } from './features/review-prescription/review-prescription.module';
import { AttachDocumentModule } from './features/attach-document/attach-document.module';

/** Composition root for the Prescriptions bounded context. */
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
