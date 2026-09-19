// * Pricing module: Defines validated DTOs for tax-rule endpoints.
// * File: src/features/tax-rules/tax-rules.schema.ts
// ? Keep transport contracts close to the tax-rules feature like the auth schemas.
export {
  TaxRuleCreateDto,
  TaxRuleListQueryDto,
  TaxRuleUpdateDto,
} from '../../contracts/pricing.schema';
