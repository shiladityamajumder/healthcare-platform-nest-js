// Linked with: @nestjs/common, ./api/http/v1/returns.controller, ./application/returns.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ReturnsController } from './api/http/v1/returns.controller';
import { ReturnsHandler } from './application/returns.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ReturnsController],
  providers: [ReturnsHandler],
})
export class ReturnsModule {}
