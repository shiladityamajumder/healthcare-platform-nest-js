import { Module } from '@nestjs/common';
import { InitiateUploadController } from './api/http/v1/initiate-upload.controller';
import { InitiateUploadHandler } from './application/initiate-upload.handler';

@Module({
  controllers: [InitiateUploadController],
  providers: [InitiateUploadHandler],
})
export class InitiateUploadModule {}
