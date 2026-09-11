// * Linked with: @nestjs/common, ./api/http/v1/templates.controller, ./application/templates.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { TemplatesController } from './api/http/v1/templates.controller';
import { TemplatesHandler } from './application/templates.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [TemplatesController],
  providers: [TemplatesHandler],
})
export class TemplatesModule {}
