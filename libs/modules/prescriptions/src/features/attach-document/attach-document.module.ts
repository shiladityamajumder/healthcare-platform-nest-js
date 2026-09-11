// * Linked with: @nestjs/common, ./api/http/v1/attach-document.controller, ./application/attach-document.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { AttachDocumentController } from './api/http/v1/attach-document.controller';
import { AttachDocumentHandler } from './application/attach-document.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [AttachDocumentController],
  providers: [AttachDocumentHandler],
})
export class AttachDocumentModule {}
