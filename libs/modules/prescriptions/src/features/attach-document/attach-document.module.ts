import { Module } from '@nestjs/common';
import { AttachDocumentController } from './api/http/v1/attach-document.controller';
import { AttachDocumentHandler } from './application/attach-document.handler';

@Module({
  controllers: [AttachDocumentController],
  providers: [AttachDocumentHandler],
})
export class AttachDocumentModule {}
