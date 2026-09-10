// Linked with: @nestjs/common, ./api/http/v1/delete-file.controller, ./application/delete-file.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { DeleteFileController } from './api/http/v1/delete-file.controller';
import { DeleteFileHandler } from './application/delete-file.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [DeleteFileController],
  providers: [DeleteFileHandler],
})
export class DeleteFileModule {}
