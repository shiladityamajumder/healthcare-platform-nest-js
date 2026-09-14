// * Linked with: @nestjs/common, ./templates.controller, ./templates.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesHandler } from './templates.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [TemplatesController],
  providers: [TemplatesHandler],
})
export class TemplatesModule {}
