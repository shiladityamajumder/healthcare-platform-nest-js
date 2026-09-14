// * Linked with: @nestjs/common, ./roles.controller, ./roles.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesHandler } from './roles.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [RolesController],
  providers: [RolesHandler],
})
export class RolesModule {}
