// * Linked with: @nestjs/common, ./attach-document.controller, ./attach-document.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { AttachDocumentController } from './attach-document.controller';
import { AttachDocumentHandler } from './attach-document.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [AttachDocumentController],
  providers: [AttachDocumentHandler],
})
export class AttachDocumentModule {}
