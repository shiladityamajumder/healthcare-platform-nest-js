// * Linked with: @nestjs/common, ./licenses.controller, ./licenses.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { LicensesController } from './licenses.controller';
import { LicensesHandler } from './licenses.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [LicensesController],
  providers: [LicensesHandler],
})
export class LicensesModule {}
