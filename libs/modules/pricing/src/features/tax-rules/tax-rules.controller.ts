import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaxRuleCreateDto, TaxRuleListQueryDto, TaxRuleUpdateDto } from './tax-rules.schema';
import { auditActor } from '../../contracts/pricing-context';
import { TaxRulesService } from './tax-rules.service';

@ApiTags('tax-rules')
@Controller({ path: 'tax-rules', version: '1' })
export class TaxRulesController {
  constructor(private readonly service: TaxRulesService) {}

  @Get()
  list(@Query() query: TaxRuleListQueryDto) {
    return this.service.listTaxRules(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: TaxRuleCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createTaxRule(body, auditActor(user));
  }

  @Get(':taxRuleId')
  get(
    @Param('taxRuleId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getTaxRule(id, deleted === 'true');
  }

  @Patch(':taxRuleId')
  update(
    @Param('taxRuleId', new ParseUUIDPipe()) id: string,
    @Body() body: TaxRuleUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateTaxRule(id, body, auditActor(user));
  }

  @Delete(':taxRuleId')
  remove(@Param('taxRuleId', new ParseUUIDPipe()) id: string, @Headers('x-user-id') user?: string) {
    return this.service.deactivateTaxRule(id, auditActor(user));
  }

  @Post(':taxRuleId/reactivate')
  reactivate(
    @Param('taxRuleId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateTaxRule(id, auditActor(user));
  }
}
