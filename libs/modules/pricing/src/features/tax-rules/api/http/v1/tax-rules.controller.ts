// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/tax-rules.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaxRulesHandler } from '../../../application/tax-rules.handler';
import { TaxRulesRequestDto } from './dto/tax-rules.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('pricing')
@Controller({ path: 'pricing/tax-rules', version: '1' })
export class TaxRulesController {
  constructor(private readonly handler: TaxRulesHandler) {}

  @Post()
  execute(@Body() request: TaxRulesRequestDto) {
    return this.handler.execute(request);
  }
}
