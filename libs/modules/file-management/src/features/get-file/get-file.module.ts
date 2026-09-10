// Linked with: @nestjs/common, ./api/http/v1/get-file.controller, ./application/get-file.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetFileController } from './api/http/v1/get-file.controller';
import { GetFileHandler } from './application/get-file.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetFileController],
  providers: [GetFileHandler],
})
export class GetFileModule {}
