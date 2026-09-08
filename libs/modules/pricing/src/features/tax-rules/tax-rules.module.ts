import { Module } from '@nestjs/common';
import { TaxRulesController } from './api/http/v1/tax-rules.controller';
import { TaxRulesHandler } from './application/tax-rules.handler';

@Module({
  controllers: [TaxRulesController],
  providers: [TaxRulesHandler],
})
export class TaxRulesModule {}
