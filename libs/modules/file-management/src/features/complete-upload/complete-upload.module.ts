// * Linked with: @nestjs/common, ./complete-upload.controller, ./complete-upload.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { CompleteUploadController } from './complete-upload.controller';
import { CompleteUploadHandler } from './complete-upload.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [CompleteUploadController],
  providers: [CompleteUploadHandler],
})
export class CompleteUploadModule {}
