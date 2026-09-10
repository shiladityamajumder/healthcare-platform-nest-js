// Linked with: @nestjs/common, ./features/initiate-upload/initiate-upload.module, ./features/complete-upload/complete-upload.module.
// Used by: the application module or feature root during NestJS startup.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { InitiateUploadModule } from './features/initiate-upload/initiate-upload.module';
import { CompleteUploadModule } from './features/complete-upload/complete-upload.module';
import { GetFileModule } from './features/get-file/get-file.module';
import { DeleteFileModule } from './features/delete-file/delete-file.module';
import { GenerateDownloadUrlModule } from './features/generate-download-url/generate-download-url.module';

/** Composition root for the FileManagement bounded context. */
// Register the feature components and their dependencies with NestJS.
@Module({
  imports: [
    InitiateUploadModule,
    CompleteUploadModule,
    GetFileModule,
    DeleteFileModule,
    GenerateDownloadUrlModule,
  ],
  exports: [],
})
export class FileManagementModule {}
