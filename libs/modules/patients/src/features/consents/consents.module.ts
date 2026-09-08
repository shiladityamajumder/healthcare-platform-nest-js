import { Module } from '@nestjs/common';
import { ConsentsController } from './api/http/v1/consents.controller';
import { ConsentsHandler } from './application/consents.handler';

@Module({
  controllers: [ConsentsController],
  providers: [ConsentsHandler],
})
export class ConsentsModule {}
