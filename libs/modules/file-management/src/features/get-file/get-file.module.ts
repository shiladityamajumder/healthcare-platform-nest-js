import { Module } from '@nestjs/common';
import { GetFileController } from './api/http/v1/get-file.controller';
import { GetFileHandler } from './application/get-file.handler';

@Module({
  controllers: [GetFileController],
  providers: [GetFileHandler],
})
export class GetFileModule {}
