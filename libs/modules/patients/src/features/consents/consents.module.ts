// * Linked with: @nestjs/common, ./api/http/v1/consents.controller, ./application/consents.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ConsentsController } from './api/http/v1/consents.controller';
import { ConsentsHandler } from './application/consents.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ConsentsController],
  providers: [ConsentsHandler],
})
export class ConsentsModule {}
