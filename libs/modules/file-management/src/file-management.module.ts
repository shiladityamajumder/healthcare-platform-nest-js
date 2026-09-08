import { Module } from '@nestjs/common';
import { InitiateUploadModule } from './features/initiate-upload/initiate-upload.module';
import { CompleteUploadModule } from './features/complete-upload/complete-upload.module';
import { GetFileModule } from './features/get-file/get-file.module';
import { DeleteFileModule } from './features/delete-file/delete-file.module';
import { GenerateDownloadUrlModule } from './features/generate-download-url/generate-download-url.module';

/** Composition root for the FileManagement bounded context. */
@Module({
  imports: [
    InitiateUploadModule,
    CompleteUploadModule,
    GetFileModule,
    DeleteFileModule,
    GenerateDownloadUrlModule
  ],
  exports: [],
})
export class FileManagementModule {}
