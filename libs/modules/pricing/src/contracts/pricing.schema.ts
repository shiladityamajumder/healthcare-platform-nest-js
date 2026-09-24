// * Pricing module: Defines validated transport DTOs shared by pricing feature schemas.
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsIn,
  IsInt,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Shared pagination fields accepted by pricing list endpoints. */
// * DTO [PricingPageQueryDto]: Validates and documents pagination data crossing the HTTP boundary.
export class PricingPageQueryDto {
  @ApiPropertyOptional({ description: '1-based result page number.', example: 1, default: 1, minimum: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @ApiPropertyOptional({ description: 'Maximum number of records to return.', example: 20, default: 20, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize = 20;
}

/** Query filters for price-book administration and selection. */
// * DTO [PriceBookListQueryDto]: Validates and documents price-book list data crossing the HTTP boundary.
export class PriceBookListQueryDto extends PricingPageQueryDto {
  @ApiPropertyOptional({ description: 'Search by price-book name.', example: 'Retail India' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) search?: string;
  @ApiPropertyOptional({ description: 'Filter by lifecycle status.', example: 'active' })
  @IsOptional() @IsString() @MaxLength(32) status?: string;
}

/** Request data required to create an effective-dated price book. */
// * DTO [PriceBookCreateDto]: Validates and documents price-book creation data crossing the HTTP boundary.
export class PriceBookCreateDto {
  @ApiProperty({ description: 'Human-readable price-book name.', example: 'Retail India Default' })
  @IsString() @MinLength(1) @MaxLength(128) name!: string;
  @ApiPropertyOptional({ description: 'ISO 4217 currency code.', example: 'INR', default: 'INR', pattern: '^[A-Za-z]{3}$' })
  @IsOptional() @Matches(/^[A-Za-z]{3}$/) currency = 'INR';
  @ApiProperty({ description: 'Sales channel served by the price book.', example: 'web' })
  @IsString() @MinLength(1) @MaxLength(32) channel!: string;
  @ApiPropertyOptional({ description: 'Optional region code used to scope the prices.', example: 'IN' })
  @IsOptional() @IsString() @MaxLength(64) regionCode?: string;
  @ApiPropertyOptional({ description: 'Optional seller UUID that owns the price book.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional() @IsUUID() sellerId?: string;
  @ApiPropertyOptional({ description: 'Optional warehouse UUID associated with the price book.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsOptional() @IsUUID() warehouseId?: string;
  @ApiProperty({ description: 'UTC date/time from which this price book is effective.', type: String, format: 'date-time', example: '2026-01-01T00:00:00.000Z' })
  @Type(() => Date) @IsDate() validFrom!: Date;
  @ApiPropertyOptional({ description: 'UTC date/time after which this price book is no longer effective.', type: String, format: 'date-time', example: '2026-12-31T23:59:59.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() validUntil?: Date;
  @ApiPropertyOptional({ description: 'Priority used when multiple books match.', example: 10, default: 0, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsInt() priority = 0;
  @ApiPropertyOptional({ description: 'Initial lifecycle status.', enum: ['draft', 'active', 'inactive', 'archived'], example: 'draft', default: 'draft' })
  @IsOptional() @IsIn(['draft', 'active', 'inactive', 'archived']) status = 'draft';
}

/** Mutable price-book fields plus the optimistic-lock version. */
// * DTO [PriceBookUpdateDto]: Validates and documents price-book update data crossing the HTTP boundary.
export class PriceBookUpdateDto {
  @ApiPropertyOptional({ description: 'Replacement price-book name.', example: 'Retail India Updated' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(128) name?: string;
  @ApiPropertyOptional({ description: 'Replacement effective start date/time.', type: String, format: 'date-time', example: '2026-02-01T00:00:00.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() validFrom?: Date;
  @ApiPropertyOptional({ description: 'Replacement effective end date/time; null removes the end date.', type: String, format: 'date-time', nullable: true, example: null })
  @IsOptional() @Type(() => Date) @IsDate() validUntil?: Date | null;
  @ApiPropertyOptional({ description: 'Replacement priority.', example: 20, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsInt() priority?: number;
  @ApiPropertyOptional({ description: 'Replacement lifecycle status.', enum: ['draft', 'active', 'inactive', 'archived'], example: 'active' })
  @IsOptional() @IsIn(['draft', 'active', 'inactive', 'archived']) status?: string;
  @ApiProperty({ description: 'Current row version required for optimistic locking.', example: 1, minimum: 1 })
  @Type(() => Number) @IsInt() @Min(1) rowVersion!: number;
}

/** Query filters for effective-dated product prices. */
// * DTO [ProductPriceListQueryDto]: Validates and documents product-price list data crossing the HTTP boundary.
export class ProductPriceListQueryDto extends PricingPageQueryDto {
  @ApiPropertyOptional({ description: 'Filter by product UUID.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional() @IsUUID() productId?: string;
  @ApiPropertyOptional({ description: 'Filter by price-book UUID.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsOptional() @IsUUID() priceBookId?: string;
  @ApiPropertyOptional({ description: 'Return prices effective at this UTC date/time.', type: String, format: 'date-time', example: '2026-06-01T00:00:00.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() activeAt?: Date;
}

/** Request data required to create a product or variant price. */
// * DTO [ProductPriceCreateDto]: Validates and documents product-price creation data crossing the HTTP boundary.
export class ProductPriceCreateDto {
  @ApiProperty({ description: 'Price-book UUID receiving the product price.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID() priceBookId!: string;
  @ApiProperty({ description: 'Product UUID for this price.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsUUID() productId!: string;
  @ApiPropertyOptional({ description: 'Optional product-variant UUID.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440003' })
  @IsOptional() @IsUUID() variantId?: string;
  @ApiProperty({ description: 'Maximum retail price as a decimal string.', example: '499.00', type: String })
  @IsNumberString() mrp!: string;
  @ApiProperty({ description: 'Selling price as a decimal string.', example: '449.00', type: String })
  @IsNumberString() sellingPrice!: string;
  @ApiPropertyOptional({ description: 'Optional cost price as a decimal string.', example: '300.00', type: String })
  @IsOptional() @IsNumberString() costPrice?: string;
  @ApiProperty({ description: 'UTC date/time from which this product price is effective.', type: String, format: 'date-time', example: '2026-01-01T00:00:00.000Z' })
  @Type(() => Date) @IsDate() validFrom!: Date;
  @ApiPropertyOptional({ description: 'UTC date/time after which this product price expires.', type: String, format: 'date-time', example: '2026-12-31T23:59:59.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() validUntil?: Date;
  @ApiPropertyOptional({ description: 'Source of the price entry.', example: 'manual', default: 'manual' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) source = 'manual';
}

/** Query filters for effective-dated tax rules. */
// * DTO [TaxRuleListQueryDto]: Validates and documents tax-rule list data crossing the HTTP boundary.
export class TaxRuleListQueryDto extends PricingPageQueryDto {
  @ApiPropertyOptional({ description: 'Filter by tax code.', example: 'GST18' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(64) taxCode?: string;
  @ApiPropertyOptional({ description: 'Two-letter country code.', example: 'IN', pattern: '^[A-Za-z]{2}$' })
  @IsOptional() @Matches(/^[A-Za-z]{2}$/) countryCode?: string;
}

/** Request data required to create an effective-dated tax rule. */
// * DTO [TaxRuleCreateDto]: Validates and documents tax-rule creation data crossing the HTTP boundary.
export class TaxRuleCreateDto {
  @ApiProperty({ description: 'Tax code used for the rule.', example: 'GST18' })
  @IsString() @MinLength(1) @MaxLength(64) taxCode!: string;
  @ApiPropertyOptional({ description: 'Two-letter country code.', example: 'IN', default: 'IN', pattern: '^[A-Za-z]{2}$' })
  @IsOptional() @Matches(/^[A-Za-z]{2}$/) countryCode = 'IN';
  @ApiPropertyOptional({ description: 'Optional state or province code.', example: 'WB' })
  @IsOptional() @IsString() @MaxLength(8) stateCode?: string;
  @ApiProperty({ description: 'Tax rate as a decimal percentage string.', example: '18.00', type: String })
  @IsNumberString() rate!: string;
  @ApiProperty({ description: 'UTC date from which this tax rule is effective.', type: String, format: 'date', example: '2026-01-01' })
  @IsDateString() validFrom!: string;
  @ApiPropertyOptional({ description: 'UTC date after which this tax rule expires.', type: String, format: 'date', example: '2026-12-31' })
  @IsOptional() @IsDateString() validUntil?: string;
  @ApiPropertyOptional({ description: 'Whether reverse-charge treatment applies.', example: false, default: false })
  @IsOptional() @IsBoolean() reverseCharge = false;
  @ApiPropertyOptional({ description: 'Additional tax-rule metadata.', type: Object, example: { category: 'medicines' }, default: {} })
  @IsOptional() @IsObject() metadataJson: Record<string, unknown> = {};
}

/** Mutable tax-rule fields plus the optimistic-lock version. */
// * DTO [TaxRuleUpdateDto]: Validates and documents tax-rule update data crossing the HTTP boundary.
export class TaxRuleUpdateDto {
  @ApiPropertyOptional({ description: 'Replacement tax rate as a decimal percentage string.', example: '12.00', type: String })
  @IsOptional() @IsNumberString() rate?: string;
  @ApiPropertyOptional({ description: 'Replacement effective start date.', type: String, format: 'date', example: '2026-02-01' })
  @IsOptional() @IsDateString() validFrom?: string;
  @ApiPropertyOptional({ description: 'Replacement effective end date; null removes the end date.', type: String, format: 'date', nullable: true, example: null })
  @IsOptional() @IsDateString() validUntil?: string | null;
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => value)
  @ApiPropertyOptional({ description: 'Replacement reverse-charge setting.', example: true })
  @IsBoolean()
  reverseCharge?: boolean;
  @ApiPropertyOptional({ description: 'Replacement tax-rule metadata.', type: Object, example: { category: 'medical-device' } })
  @IsOptional() @IsObject() metadataJson?: Record<string, unknown>;
  @ApiProperty({ description: 'Current row version required for optimistic locking.', example: 1, minimum: 1 })
  @Type(() => Number) @IsInt() @Min(1) rowVersion!: number;
}

/** Query filters for promotion definitions. */
// * DTO [PromotionListQueryDto]: Validates and documents promotion list data crossing the HTTP boundary.
export class PromotionListQueryDto extends PricingPageQueryDto {
  @ApiPropertyOptional({ description: 'Search by promotion code or name.', example: 'WELCOME' })
  @IsOptional() @IsString() @MaxLength(100) search?: string;
  @ApiPropertyOptional({ description: 'Filter by promotion lifecycle status.', example: 'active' })
  @IsOptional() @IsString() @MaxLength(32) status?: string;
  @ApiPropertyOptional({ description: 'Return active promotions at this UTC date/time.', type: String, format: 'date-time', example: '2026-06-01T00:00:00.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() activeAt?: Date;
}

/** Request data required to create a promotion definition. */
// * DTO [PromotionCreateDto]: Validates and documents promotion creation data crossing the HTTP boundary.
export class PromotionCreateDto {
  @ApiProperty({ description: 'Unique promotion code; the API stores it in uppercase.', example: 'WELCOME10' })
  @IsString() @MinLength(1) @MaxLength(64) code!: string;
  @ApiProperty({ description: 'Promotion name shown to operators.', example: 'Welcome discount' })
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @ApiProperty({ description: 'Business promotion type interpreted by the checkout/pricing engine.', example: 'percentage' })
  @IsString() @MinLength(1) @MaxLength(32) promotionType!: string;
  @ApiPropertyOptional({ description: 'Group used to determine promotion stackability.', example: 'WELCOME' })
  @IsOptional() @IsString() @MaxLength(64) stackabilityGroup?: string;
  @ApiPropertyOptional({ description: 'Evaluation priority; higher values are evaluated first.', example: 10, default: 0, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) priority = 0;
  @ApiPropertyOptional({ description: 'Maximum promotion budget as a decimal string.', example: '100000.00', type: String })
  @IsOptional() @IsNumberString() budgetAmount?: string;
  @ApiPropertyOptional({ description: 'Maximum total number of redemptions.', example: 1000, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) usageLimit?: number;
  @ApiPropertyOptional({ description: 'Maximum redemptions allowed for one user.', example: 1, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) perUserLimit?: number;
  @ApiProperty({ description: 'UTC date/time from which the promotion can be applied.', type: String, format: 'date-time', example: '2026-01-01T00:00:00.000Z' })
  @Type(() => Date) @IsDate() startsAt!: Date;
  @ApiPropertyOptional({ description: 'UTC date/time after which the promotion can no longer be applied.', type: String, format: 'date-time', example: '2026-12-31T23:59:59.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() endsAt?: Date;
  @ApiPropertyOptional({ description: 'Initial lifecycle status.', enum: ['draft', 'active', 'inactive', 'archived'], example: 'draft', default: 'draft' })
  @IsOptional() @IsIn(['draft', 'active', 'inactive', 'archived']) status = 'draft';
  @ApiPropertyOptional({ description: 'Whether the promotion cannot be combined with other promotions.', example: false, default: false })
  @IsOptional() @IsBoolean() exclusive = false;
}

/** Mutable promotion fields plus the optimistic-lock version. */
// * DTO [PromotionUpdateDto]: Validates and documents promotion update data crossing the HTTP boundary.
export class PromotionUpdateDto {
  @ApiPropertyOptional({ description: 'Replacement promotion code; stored in uppercase.', example: 'WELCOME15' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(64) code?: string;
  @ApiPropertyOptional({ description: 'Replacement operator-facing promotion name.', example: 'Welcome discount updated' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) name?: string;
  @ApiPropertyOptional({ description: 'Replacement business promotion type.', example: 'fixed_amount' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) promotionType?: string;
  @ApiPropertyOptional({ description: 'Replacement stackability group; null clears it.', example: null, nullable: true })
  @IsOptional() @IsString() @MaxLength(64) stackabilityGroup?: string | null;
  @ApiPropertyOptional({ description: 'Replacement evaluation priority.', example: 20, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) priority?: number;
  @ApiPropertyOptional({ description: 'Replacement budget as a decimal string; null clears it.', example: null, type: String, nullable: true })
  @IsOptional() @IsNumberString() budgetAmount?: string | null;
  @ApiPropertyOptional({ description: 'Replacement total usage limit; null removes the limit.', example: 5000, nullable: true, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) usageLimit?: number | null;
  @ApiPropertyOptional({ description: 'Replacement per-user limit; null removes the limit.', example: 2, nullable: true, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) perUserLimit?: number | null;
  @ApiPropertyOptional({ description: 'Replacement UTC effective start date/time.', type: String, format: 'date-time', example: '2026-02-01T00:00:00.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() startsAt?: Date;
  @ApiPropertyOptional({ description: 'Replacement UTC effective end date/time; null removes the end date.', type: String, format: 'date-time', nullable: true, example: null })
  @IsOptional() @Type(() => Date) @IsDate() endsAt?: Date | null;
  @ApiPropertyOptional({ description: 'Replacement lifecycle status.', enum: ['draft', 'active', 'inactive', 'archived'], example: 'active' })
  @IsOptional() @IsIn(['draft', 'active', 'inactive', 'archived']) status?: string;
  @ApiPropertyOptional({ description: 'Replacement exclusive-promotion setting.', example: true })
  @IsOptional() @IsBoolean() exclusive?: boolean;
  @ApiProperty({ description: 'Current row version required for optimistic locking.', example: 1, minimum: 1 })
  @Type(() => Number) @IsInt() @Min(1) rowVersion!: number;
}

/** Query filters for promotion version history. */
// * DTO [PromotionVersionListQueryDto]: Validates and documents promotion-version list data crossing the HTTP boundary.
export class PromotionVersionListQueryDto extends PricingPageQueryDto {
  @ApiPropertyOptional({ description: 'Return only versions that have been published.', example: false, default: false })
  @IsOptional() @Transform(({ value }: { value: unknown }) => value === 'true') @IsBoolean()
  publishedOnly = false;
}

/** Versioned promotion rules and benefits to create or publish. */
// * DTO [PromotionVersionCreateDto]: Validates and documents promotion-version data crossing the HTTP boundary.
export class PromotionVersionCreateDto {
  @ApiProperty({ description: 'Monotonically increasing version number within the promotion.', example: 1, minimum: 1 })
  @IsInt() @Min(1) versionNo!: number;
  @ApiProperty({ description: 'Rule configuration consumed by the pricing engine.', type: Object, example: { minimumOrderValue: '999.00', categories: ['medicine'] } })
  @IsObject() rules!: Record<string, unknown>;
  @ApiProperty({ description: 'Benefit configuration produced when the rules match.', type: Object, example: { discountPercent: 10, maxDiscount: '200.00' } })
  @IsObject() benefits!: Record<string, unknown>;
  @ApiPropertyOptional({ description: 'UTC publish date/time; omit to create an unpublished draft.', type: String, format: 'date-time', example: '2026-01-01T00:00:00.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() publishedAt?: Date;
}

/** Query filters for coupon-code lifecycle and validity views. */
// * DTO [CouponCodeListQueryDto]: Validates and documents coupon-code list data crossing the HTTP boundary.
export class CouponCodeListQueryDto extends PricingPageQueryDto {
  @ApiPropertyOptional({ description: 'Filter by promotion UUID.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440004' })
  @IsOptional() @IsUUID() promotionId?: string;
  @ApiPropertyOptional({ description: 'Filter by assigned user UUID.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440005' })
  @IsOptional() @IsUUID() assignedUserId?: string;
  @ApiPropertyOptional({ description: 'Search by coupon code.', example: 'WELCOME2026' })
  @IsOptional() @IsString() @MaxLength(64) search?: string;
  @ApiPropertyOptional({ description: 'Return active coupon codes at this UTC date/time.', type: String, format: 'date-time', example: '2026-06-01T00:00:00.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() activeAt?: Date;
}

/** Request data required to create a coupon code. */
// * DTO [CouponCodeCreateDto]: Validates and documents coupon-code creation data crossing the HTTP boundary.
export class CouponCodeCreateDto {
  @ApiProperty({ description: 'Promotion UUID to which this coupon belongs.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440004' })
  @IsUUID() promotionId!: string;
  @ApiProperty({ description: 'Unique coupon code; the API stores it in uppercase.', example: 'WELCOME2026' })
  @IsString() @MinLength(1) @MaxLength(64) code!: string;
  @ApiPropertyOptional({ description: 'Maximum number of redemptions for this code.', example: 100, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) maxRedemptions?: number;
  @ApiPropertyOptional({ description: 'Optional user UUID to whom the coupon is assigned.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440005' })
  @IsOptional() @IsUUID() assignedUserId?: string;
  @ApiPropertyOptional({ description: 'UTC date/time from which the coupon is valid.', type: String, format: 'date-time', example: '2026-01-01T00:00:00.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() validFrom?: Date;
  @ApiPropertyOptional({ description: 'UTC date/time after which the coupon is invalid.', type: String, format: 'date-time', example: '2026-12-31T23:59:59.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() validUntil?: Date;
  @ApiPropertyOptional({ description: 'Whether the coupon can currently be redeemed.', example: true, default: true })
  @IsOptional() @IsBoolean() isActive = true;
}

/** Mutable coupon-code fields plus the optimistic-lock version. */
// * DTO [CouponCodeUpdateDto]: Validates and documents coupon-code update data crossing the HTTP boundary.
export class CouponCodeUpdateDto {
  @ApiPropertyOptional({ description: 'Replacement coupon code; stored in uppercase.', example: 'WELCOME2026VIP' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(64) code?: string;
  @ApiPropertyOptional({ description: 'Replacement redemption limit; null removes the limit.', example: 200, nullable: true, minimum: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) maxRedemptions?: number | null;
  @ApiPropertyOptional({ description: 'Replacement assigned user UUID; null makes it unassigned.', format: 'uuid', nullable: true, example: null })
  @IsOptional() @IsUUID() assignedUserId?: string | null;
  @ApiPropertyOptional({ description: 'Replacement UTC validity start; null removes the start limit.', type: String, format: 'date-time', nullable: true, example: null })
  @IsOptional() @Type(() => Date) @IsDate() validFrom?: Date | null;
  @ApiPropertyOptional({ description: 'Replacement UTC validity end; null removes the end limit.', type: String, format: 'date-time', nullable: true, example: null })
  @IsOptional() @Type(() => Date) @IsDate() validUntil?: Date | null;
  @ApiPropertyOptional({ description: 'Enable or disable coupon redemption.', example: false })
  @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiProperty({ description: 'Current row version required for optimistic locking.', example: 1, minimum: 1 })
  @Type(() => Number) @IsInt() @Min(1) rowVersion!: number;
}

/** Query filters for promotion redemption history. */
// * DTO [PromotionRedemptionListQueryDto]: Validates and documents redemption list data crossing the HTTP boundary.
export class PromotionRedemptionListQueryDto extends PricingPageQueryDto {
  @ApiPropertyOptional({ description: 'Filter by promotion UUID.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440004' })
  @IsOptional() @IsUUID() promotionId?: string;
  @ApiPropertyOptional({ description: 'Filter by user UUID.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440005' })
  @IsOptional() @IsUUID() userId?: string;
  @ApiPropertyOptional({ description: 'Filter by order UUID.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440006' })
  @IsOptional() @IsUUID() orderId?: string;
}

/** Request data required to record a promotion redemption. */
// * DTO [PromotionRedemptionCreateDto]: Validates and documents redemption data crossing the HTTP boundary.
export class PromotionRedemptionCreateDto {
  @ApiProperty({ description: 'Promotion UUID being redeemed.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440004' })
  @IsUUID() promotionId!: string;
  @ApiPropertyOptional({ description: 'Optional promotion-version UUID used for the redemption.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440007' })
  @IsOptional() @IsUUID() promotionVersionId?: string;
  @ApiPropertyOptional({ description: 'Optional coupon-code UUID used for the redemption.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440008' })
  @IsOptional() @IsUUID() couponCodeId?: string;
  @ApiProperty({ description: 'User UUID receiving the promotion benefit.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440005' })
  @IsUUID() userId!: string;
  @ApiPropertyOptional({ description: 'Order UUID associated with the redemption.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440006' })
  @IsOptional() @IsUUID() orderId?: string;
  @ApiProperty({ description: 'Discount amount recorded as a decimal string.', example: '100.00', type: String })
  @IsNumberString() discountAmount!: string;
  @ApiPropertyOptional({ description: 'UTC redemption date/time; defaults to the current time when omitted.', type: String, format: 'date-time', example: '2026-06-01T12:00:00.000Z' })
  @IsOptional() @Type(() => Date) @IsDate() redeemedAt?: Date;
  @ApiProperty({ description: 'Client/order idempotency key. Reusing it is rejected to prevent duplicate redemption records.', example: 'checkout-order-10001-promo-WELCOME10' })
  @IsString() @MinLength(1) @MaxLength(128) idempotencyKey!: string;
}

/** Query filters for pricing-engine evaluation snapshots. */
// * DTO [PricingEvaluationListQueryDto]: Validates and documents evaluation list data crossing the HTTP boundary.
export class PricingEvaluationListQueryDto extends PricingPageQueryDto {
  @ApiPropertyOptional({ description: 'Filter by reference type.', example: 'order' })
  @IsOptional() @IsString() @MaxLength(32) referenceType?: string;
  @ApiPropertyOptional({ description: 'Filter by reference UUID.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440006' })
  @IsOptional() @IsUUID() referenceId?: string;
  @ApiPropertyOptional({ description: 'Filter by evaluated user UUID.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440005' })
  @IsOptional() @IsUUID() userId?: string;
}

/** Request data required to record a pricing-engine evaluation snapshot. */
// * DTO [PricingEvaluationCreateDto]: Validates and documents evaluation data crossing the HTTP boundary.
export class PricingEvaluationCreateDto {
  @ApiProperty({ description: 'Type of entity being priced.', example: 'order' })
  @IsString() @MinLength(1) @MaxLength(32) referenceType!: string;
  @ApiProperty({ description: 'UUID of the entity being priced.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440006' })
  @IsUUID() referenceId!: string;
  @ApiPropertyOptional({ description: 'Optional user UUID for whom pricing was evaluated.', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440005' })
  @IsOptional() @IsUUID() userId?: string;
  @ApiProperty({ description: 'Input snapshot supplied to the pricing engine.', type: Object, example: { items: [{ productId: '550e8400-e29b-41d4-a716-446655440002', quantity: 2 }], subtotal: '998.00' } })
  @IsObject() requestPayload!: Record<string, unknown>;
  @ApiProperty({ description: 'Output snapshot returned by the pricing engine.', type: Object, example: { subtotal: '998.00', discount: '100.00', total: '898.00' } })
  @IsObject() responseSnapshot!: Record<string, unknown>;
  @ApiProperty({ description: 'Pricing-rule version used for this evaluation.', example: 'promotion-v3' })
  @IsString() @MinLength(1) @MaxLength(64) ruleVersion!: string;
}
