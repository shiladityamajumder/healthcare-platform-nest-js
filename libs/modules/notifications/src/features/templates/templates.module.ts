import { Module } from '@nestjs/common';
import { TemplatesController } from './api/http/v1/templates.controller';
import { TemplatesHandler } from './application/templates.handler';

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesHandler],
})
export class TemplatesModule {}
