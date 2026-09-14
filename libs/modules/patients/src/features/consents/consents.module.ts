// * Linked with: @nestjs/common, ./consents.controller, ./consents.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ConsentsController } from './consents.controller';
import { ConsentsHandler } from './consents.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ConsentsController],
  providers: [ConsentsHandler],
})
export class ConsentsModule {}
