// Linked with: @nestjs/common, ./api/http/v1/initiate-upload.controller, ./application/initiate-upload.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { InitiateUploadController } from './api/http/v1/initiate-upload.controller';
import { InitiateUploadHandler } from './application/initiate-upload.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [InitiateUploadController],
  providers: [InitiateUploadHandler],
})
export class InitiateUploadModule {}
