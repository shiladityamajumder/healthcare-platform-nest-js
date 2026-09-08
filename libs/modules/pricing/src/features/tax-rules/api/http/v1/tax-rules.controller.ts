import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaxRulesHandler } from '../../../application/tax-rules.handler';
import { TaxRulesRequestDto } from './dto/tax-rules.request.dto';

@ApiTags('pricing')
@Controller({ path: 'pricing/tax-rules', version: '1' })
export class TaxRulesController {
  constructor(private readonly handler: TaxRulesHandler) {}

  @Post()
  execute(@Body() request: TaxRulesRequestDto) {
    return this.handler.execute(request);
  }
}
