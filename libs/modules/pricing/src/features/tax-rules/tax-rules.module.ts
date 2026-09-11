// * Linked with: @nestjs/common, ./api/http/v1/tax-rules.controller, ./application/tax-rules.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { TaxRulesController } from './api/http/v1/tax-rules.controller';
import { TaxRulesHandler } from './application/tax-rules.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [TaxRulesController],
  providers: [TaxRulesHandler],
})
export class TaxRulesModule {}
