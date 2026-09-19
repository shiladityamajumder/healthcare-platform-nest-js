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

export class PricingPageQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize = 20;
}

export class PriceBookListQueryDto extends PricingPageQueryDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(100) search?: string;
  @IsOptional() @IsString() @MaxLength(32) status?: string;
}

export class PriceBookCreateDto {
  @IsString() @MinLength(1) @MaxLength(128) name!: string;
  @IsOptional() @Matches(/^[A-Za-z]{3}$/) currency = 'INR';
  @IsString() @MinLength(1) @MaxLength(32) channel!: string;
  @IsOptional() @IsString() @MaxLength(64) regionCode?: string;
  @IsOptional() @IsUUID() sellerId?: string;
  @IsOptional() @IsUUID() warehouseId?: string;
  @Type(() => Date) @IsDate() validFrom!: Date;
  @IsOptional() @Type(() => Date) @IsDate() validUntil?: Date;
  @IsOptional() @Type(() => Number) @IsInt() priority = 0;
  @IsOptional() @IsIn(['draft', 'active', 'inactive', 'archived']) status = 'draft';
}

export class PriceBookUpdateDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(128) name?: string;
  @IsOptional() @Type(() => Date) @IsDate() validFrom?: Date;
  @IsOptional() @Type(() => Date) @IsDate() validUntil?: Date | null;
  @IsOptional() @Type(() => Number) @IsInt() priority?: number;
  @IsOptional() @IsIn(['draft', 'active', 'inactive', 'archived']) status?: string;
  @Type(() => Number) @IsInt() @Min(1) rowVersion!: number;
}

export class ProductPriceListQueryDto extends PricingPageQueryDto {
  @IsOptional() @IsUUID() productId?: string;
  @IsOptional() @IsUUID() priceBookId?: string;
  @IsOptional() @Type(() => Date) @IsDate() activeAt?: Date;
}

export class ProductPriceCreateDto {
  @IsUUID() priceBookId!: string;
  @IsUUID() productId!: string;
  @IsOptional() @IsUUID() variantId?: string;
  @IsNumberString() mrp!: string;
  @IsNumberString() sellingPrice!: string;
  @IsOptional() @IsNumberString() costPrice?: string;
  @Type(() => Date) @IsDate() validFrom!: Date;
  @IsOptional() @Type(() => Date) @IsDate() validUntil?: Date;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) source = 'manual';
}

export class TaxRuleListQueryDto extends PricingPageQueryDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(64) taxCode?: string;
  @IsOptional() @Matches(/^[A-Za-z]{2}$/) countryCode?: string;
}

export class TaxRuleCreateDto {
  @IsString() @MinLength(1) @MaxLength(64) taxCode!: string;
  @IsOptional() @Matches(/^[A-Za-z]{2}$/) countryCode = 'IN';
  @IsOptional() @IsString() @MaxLength(8) stateCode?: string;
  @IsNumberString() rate!: string;
  @IsDateString() validFrom!: string;
  @IsOptional() @IsDateString() validUntil?: string;
  @IsOptional() @IsBoolean() reverseCharge = false;
  @IsOptional() @IsObject() metadataJson: Record<string, unknown> = {};
}

export class TaxRuleUpdateDto {
  @IsOptional() @IsNumberString() rate?: string;
  @IsOptional() @IsDateString() validFrom?: string;
  @IsOptional() @IsDateString() validUntil?: string | null;
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => value)
  @IsBoolean()
  reverseCharge?: boolean;
  @IsOptional() @IsObject() metadataJson?: Record<string, unknown>;
  @Type(() => Number) @IsInt() @Min(1) rowVersion!: number;
}
