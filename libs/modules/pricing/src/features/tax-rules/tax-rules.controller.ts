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
// * Pricing module: Exposes tax-rule administration and lifecycle endpoints.
// * File: src/features/tax-rules/tax-rules.controller.ts
// ? Keep HTTP concerns at the controller boundary and delegate tax-rule rules to TaxRulesService.
// ! Do not bypass DTO validation, audit-context normalization, or the application service.
import {
  ApiPricingAuditHeader,
  ApiPricingBody,
  ApiPricingErrors,
  ApiPricingIncludeDeletedQuery,
  ApiPricingOperation,
  ApiPricingPaginatedResponse,
  ApiPricingQuery,
  ApiPricingResponse,
  ApiPricingUuidParam,
  ApiPricingValidationError,
} from '../../contracts/swagger';
import { TaxRulesService } from './tax-rules.service';

@ApiTags('tax-rules')
@Controller({ path: 'tax-rules', version: '1' })
@ApiPricingErrors({
  notFound: 'The requested tax rule does not exist or is not visible to the current operation.',
  conflict: 'The tax code, region, and effective-date window conflicts with another tax rule.',
  unavailable: 'The pricing database is temporarily unavailable. Retry using the request ID for support.',
  internal: 'An unexpected pricing failure occurred while processing the request.',
})
/** HTTP routes for tax-rule listing, maintenance, and lifecycle management. */
export class TaxRulesController {
  // * Function [constructor]: Initializes the controller with its feature service.
  constructor(private readonly service: TaxRulesService) {}

  // * Function [list]: Returns paginated tax rules for tax calculation and administration.
  @Get()
  @ApiPricingOperation('List tax rules', 'Returns paginated effective-dated tax rules for tax-code and country/region resolution during pricing and checkout.')
  @ApiPricingQuery(TaxRuleListQueryDto, 'Optional tax-code, country-code, page, and page-size filters.')
  @ApiPricingPaginatedResponse('Tax rules returned.', [{ id: '550e8400-e29b-41d4-a716-446655440010', taxCode: 'GST18', countryCode: 'IN', rate: '18.00', rowVersion: 1 }])
  @ApiPricingValidationError()
  list(@Query() query: TaxRuleListQueryDto) {
    return this.service.listTaxRules(query);
  }

  // * Function [create]: Creates a validated, non-overlapping effective-dated tax rule.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiPricingOperation('Create a tax rule', 'Creates a non-overlapping effective-dated tax rule for a tax code and geographic scope.')
  @ApiPricingBody(TaxRuleCreateDto, 'Tax code, country/state scope, rate, validity dates, reverse-charge setting, and metadata.')
  @ApiPricingResponse('Tax rule created.', { id: '550e8400-e29b-41d4-a716-446655440010', taxCode: 'GST18', rate: '18.00', rowVersion: 1 }, HttpStatus.CREATED)
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  create(@Body() body: TaxRuleCreateDto, @Headers('x-user-id') user?: string) {
    return this.service.createTaxRule(body, auditActor(user));
  }

  // * Function [get]: Retrieves one tax rule, optionally including soft-deleted history.
  @Get(':taxRuleId')
  @ApiPricingOperation('Get a tax rule', 'Returns one tax rule and its current version for administration or tax calculation inspection.')
  @ApiPricingUuidParam('taxRuleId', 'Tax-rule UUID to retrieve.')
  @ApiPricingIncludeDeletedQuery()
  @ApiPricingResponse('Tax rule returned.', { id: '550e8400-e29b-41d4-a716-446655440010', taxCode: 'GST18', countryCode: 'IN', rate: '18.00', rowVersion: 1 })
  @ApiPricingValidationError()
  get(
    @Param('taxRuleId', new ParseUUIDPipe()) id: string,
    @Query('includeDeleted') deleted?: string,
  ) {
    return this.service.getTaxRule(id, deleted === 'true');
  }

  // * Function [update]: Updates mutable tax-rule fields using the supplied row version.
  @Patch(':taxRuleId')
  @ApiPricingOperation('Update a tax rule', 'Updates mutable tax-rule fields using optimistic locking and rechecks effective-window overlap.')
  @ApiPricingUuidParam('taxRuleId', 'Tax-rule UUID to update.')
  @ApiPricingBody(TaxRuleUpdateDto, 'Replacement tax fields and the current rowVersion.')
  @ApiPricingResponse('Tax rule updated.', { id: '550e8400-e29b-41d4-a716-446655440010', rate: '12.00', rowVersion: 2 })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  update(
    @Param('taxRuleId', new ParseUUIDPipe()) id: string,
    @Body() body: TaxRuleUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.updateTaxRule(id, body, auditActor(user));
  }

  // * Function [remove]: Deactivates a tax rule without removing its historical record.
  @Delete(':taxRuleId')
  @ApiPricingOperation('Deactivate a tax rule', 'Soft-deactivates a tax rule so it is excluded from normal resolution while preserving its audit history.')
  @ApiPricingUuidParam('taxRuleId', 'Tax-rule UUID to deactivate.')
  @ApiPricingResponse('Tax rule deactivated.', { message: 'The tax rule has been deactivated.' })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  remove(@Param('taxRuleId', new ParseUUIDPipe()) id: string, @Headers('x-user-id') user?: string) {
    return this.service.deactivateTaxRule(id, auditActor(user));
  }

  // * Function [reactivate]: Restores a previously deactivated tax rule.
  @Post(':taxRuleId/reactivate')
  @ApiPricingOperation('Reactivate a tax rule', 'Restores a soft-deleted tax rule so an operator can review and use it again.')
  @ApiPricingUuidParam('taxRuleId', 'Tax-rule UUID to reactivate.')
  @ApiPricingResponse('Tax rule reactivated.', { id: '550e8400-e29b-41d4-a716-446655440010', rowVersion: 3 })
  @ApiPricingValidationError()
  @ApiPricingAuditHeader()
  reactivate(
    @Param('taxRuleId', new ParseUUIDPipe()) id: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.service.reactivateTaxRule(id, auditActor(user));
  }
}
