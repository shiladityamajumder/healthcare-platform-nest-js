// * Linked with: @nestjs/common, ./api/http/v1/licenses.controller, ./application/licenses.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { LicensesController } from './api/http/v1/licenses.controller';
import { LicensesHandler } from './application/licenses.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [LicensesController],
  providers: [LicensesHandler],
})
export class LicensesModule {}
