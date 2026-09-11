// * Linked with: @nestjs/common, ./api/http/v1/complete-upload.controller, ./application/complete-upload.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CompleteUploadController } from './api/http/v1/complete-upload.controller';
import { CompleteUploadHandler } from './application/complete-upload.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CompleteUploadController],
  providers: [CompleteUploadHandler],
})
export class CompleteUploadModule {}
