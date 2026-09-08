import { Module } from '@nestjs/common';
import { CompleteUploadController } from './api/http/v1/complete-upload.controller';
import { CompleteUploadHandler } from './application/complete-upload.handler';

@Module({
  controllers: [CompleteUploadController],
  providers: [CompleteUploadHandler],
})
export class CompleteUploadModule {}
