// * Linked with: the feature controller and the public API contract.
// * Used by: controllers and validation/serialization at the HTTP boundary.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const booleanValue = ({ value }: { value: unknown }): unknown => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

export class WarehouseListQueryDto {
  @IsOptional() @IsString() @MaxLength(200) search?: string;
  @IsOptional() @IsString() @MaxLength(32) status?: string;
  @IsOptional() @IsString() @MaxLength(32) warehouseType?: string;
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsColdChain?: boolean;
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsControlledDrugs?: boolean;
  @IsOptional() @Transform(booleanValue) @IsBoolean() includeDeleted = false;
  @IsOptional() @IsString() sortBy = 'name';
  @IsOptional() @IsString() sortOrder: 'asc' | 'desc' = 'asc';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize = 20;
}

export class WarehouseCreateDto {
  @IsUUID() organizationId!: string;
  @IsUUID() locationId!: string;
  @IsString() @MinLength(1) @MaxLength(64) code!: string;
  @IsString() @MinLength(1) @MaxLength(150) name!: string;
  @IsString() @MinLength(1) @MaxLength(32) warehouseType!: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) status = 'active';
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsColdChain = false;
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsControlledDrugs = false;
  @IsOptional() @IsObject() operatingHours: Record<string, unknown> | unknown[] = {};
}

export class WarehouseUpdateDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(150) name?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) warehouseType?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) status?: string;
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsColdChain?: boolean;
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsControlledDrugs?: boolean;
  @IsOptional() @IsObject() operatingHours?: Record<string, unknown> | unknown[];
}

export class ReplenishmentRuleUpsertDto {
  @IsUUID() warehouseId!: string;
  @IsUUID() productId!: string;
  @IsOptional() @IsUUID() variantId?: string;
  @IsString() @IsNotEmpty() minimumQuantity!: string;
  @IsString() @IsNotEmpty() maximumQuantity!: string;
  @IsString() @IsNotEmpty() reorderQuantity!: string;
  @IsOptional() @IsUUID() preferredSupplierId?: string;
  @IsOptional() @Transform(booleanValue) @IsBoolean() isActive = true;
}

/** Backwards-compatible name retained for the original scaffold import. */
export class WarehousesRequestDto extends WarehouseCreateDto {}
