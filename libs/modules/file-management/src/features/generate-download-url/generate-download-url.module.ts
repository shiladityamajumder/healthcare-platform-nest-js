// * Linked with: @nestjs/common, ./api/http/v1/generate-download-url.controller, ./application/generate-download-url.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GenerateDownloadUrlController } from './api/http/v1/generate-download-url.controller';
import { GenerateDownloadUrlHandler } from './application/generate-download-url.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GenerateDownloadUrlController],
  providers: [GenerateDownloadUrlHandler],
})
export class GenerateDownloadUrlModule {}
