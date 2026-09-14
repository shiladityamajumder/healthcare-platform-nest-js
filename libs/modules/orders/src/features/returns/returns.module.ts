// * Linked with: @nestjs/common, ./returns.controller, ./returns.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { ReturnsController } from './returns.controller';
import { ReturnsHandler } from './returns.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [ReturnsController],
  providers: [ReturnsHandler],
})
export class ReturnsModule {}
