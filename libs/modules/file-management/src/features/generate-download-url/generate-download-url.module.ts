import { Module } from '@nestjs/common';
import { GenerateDownloadUrlController } from './api/http/v1/generate-download-url.controller';
import { GenerateDownloadUrlHandler } from './application/generate-download-url.handler';

@Module({
  controllers: [GenerateDownloadUrlController],
  providers: [GenerateDownloadUrlHandler],
})
export class GenerateDownloadUrlModule {}
