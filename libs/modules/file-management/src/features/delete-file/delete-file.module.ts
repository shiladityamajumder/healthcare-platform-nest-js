import { Module } from '@nestjs/common';
import { DeleteFileController } from './api/http/v1/delete-file.controller';
import { DeleteFileHandler } from './application/delete-file.handler';

@Module({
  controllers: [DeleteFileController],
  providers: [DeleteFileHandler],
})
export class DeleteFileModule {}
