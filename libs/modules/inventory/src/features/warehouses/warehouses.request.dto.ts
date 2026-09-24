// * Linked with: the feature controller and the public API contract.
// * Used by: controllers and validation/serialization at the HTTP boundary.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
// * Inventory module: Defines validated warehouse and replenishment request contracts.
// * File: src/features/warehouses/warehouses.request.dto.ts
// ? Keep these transport DTOs separate from externally managed warehouse table rows.
// ! Row versions are required for mutable resources to prevent lost concurrent updates.
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

/** Filters and paginates warehouse administration listings. */
export class WarehouseListQueryDto {
  @ApiPropertyOptional({ description: 'Search warehouse name or code.', example: 'Kolkata' })
  @IsOptional() @IsString() @MaxLength(200) search?: string;
  @ApiPropertyOptional({ description: 'Warehouse lifecycle status.', example: 'active' })
  @IsOptional() @IsString() @MaxLength(32) status?: string;
  @ApiPropertyOptional({ description: 'Warehouse type.', example: 'central' })
  @IsOptional() @IsString() @MaxLength(32) warehouseType?: string;
  @ApiPropertyOptional({ description: 'Filter warehouses supporting cold-chain storage.', example: true })
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsColdChain?: boolean;
  @ApiPropertyOptional({ description: 'Filter warehouses supporting controlled drugs.', example: false })
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsControlledDrugs?: boolean;
  @ApiPropertyOptional({ description: 'Include soft-deleted warehouses.', default: false })
  @IsOptional() @Transform(booleanValue) @IsBoolean() includeDeleted = false;
  @ApiPropertyOptional({ description: 'Sort key.', enum: ['name', 'code', 'createdAt'], default: 'name' })
  @IsOptional() @IsString() sortBy = 'name';
  @ApiPropertyOptional({ description: 'Sort direction.', enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional() @IsString() sortOrder: 'asc' | 'desc' = 'asc';
  @ApiPropertyOptional({ description: 'One-based page number.', default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @ApiPropertyOptional({ description: 'Maximum records per page.', default: 20, minimum: 1, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize = 20;
}

/** Creates a warehouse linked to an organization location. */
export class WarehouseCreateDto {
  @ApiProperty({ format: 'uuid', description: 'Owning organization UUID.' })
  @IsUUID() organizationId!: string;
  @ApiProperty({ format: 'uuid', description: 'Organization location UUID.' })
  @IsUUID() locationId!: string;
  @ApiProperty({ description: 'Unique warehouse code.', example: 'WH-KOL-01' })
  @IsString() @MinLength(1) @MaxLength(64) code!: string;
  @ApiProperty({ description: 'Display name.', example: 'Kolkata Central Warehouse' })
  @IsString() @MinLength(1) @MaxLength(150) name!: string;
  @ApiProperty({ description: 'Warehouse classification.', example: 'central' })
  @IsString() @MinLength(1) @MaxLength(32) warehouseType!: string;
  @ApiPropertyOptional({ description: 'Initial lifecycle status.', default: 'active', example: 'active' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) status = 'active';
  @ApiPropertyOptional({ description: 'Whether cold-chain inventory is supported.', default: false })
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsColdChain = false;
  @ApiPropertyOptional({ description: 'Whether controlled drugs are supported.', default: false })
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsControlledDrugs = false;
  @ApiPropertyOptional({ description: 'Warehouse operating-hours JSON object.', example: { monday: { open: '09:00', close: '18:00' } } })
  @IsOptional() @IsObject() operatingHours: Record<string, unknown> | unknown[] = {};
}

/** Updates mutable warehouse fields with optimistic-lock control. */
export class WarehouseUpdateDto {
  @ApiPropertyOptional({ description: 'Replacement display name.', example: 'Kolkata Fulfilment Warehouse' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(150) name?: string;
  @ApiPropertyOptional({ description: 'Replacement warehouse type.', example: 'fulfilment' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) warehouseType?: string;
  @ApiPropertyOptional({ description: 'Replacement lifecycle status.', example: 'active' })
  @IsOptional() @IsString() @MinLength(1) @MaxLength(32) status?: string;
  @ApiPropertyOptional({ description: 'Replacement cold-chain capability.' })
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsColdChain?: boolean;
  @ApiPropertyOptional({ description: 'Replacement controlled-drug capability.' })
  @IsOptional() @Transform(booleanValue) @IsBoolean() supportsControlledDrugs?: boolean;
  @ApiPropertyOptional({ description: 'Replacement operating-hours JSON object.' })
  @IsOptional() @IsObject() operatingHours?: Record<string, unknown> | unknown[];
  @ApiProperty({ description: 'Current row version used for optimistic locking.', example: 1, minimum: 1 })
  @Type(() => Number) @IsInt() @Min(1) rowVersion!: number;
}

/** Creates or updates low-stock thresholds for one product in one warehouse. */
export class ReplenishmentRuleUpsertDto {
  @ApiProperty({ format: 'uuid', description: 'Warehouse where the rule applies.' })
  @IsUUID() warehouseId!: string;
  @ApiProperty({ format: 'uuid', description: 'Product controlled by the rule.' })
  @IsUUID() productId!: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Optional product variant.' })
  @IsOptional() @IsUUID() variantId?: string;
  @ApiProperty({ description: 'Minimum quantity before stock is considered low.', example: '20.000' })
  @IsString() @IsNotEmpty() minimumQuantity!: string;
  @ApiProperty({ description: 'Maximum desired quantity.', example: '100.000' })
  @IsString() @IsNotEmpty() maximumQuantity!: string;
  @ApiProperty({ description: 'Quantity suggested when replenishment is triggered.', example: '50.000' })
  @IsString() @IsNotEmpty() reorderQuantity!: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Preferred supplier for replenishment.' })
  @IsOptional() @IsUUID() preferredSupplierId?: string;
  @ApiPropertyOptional({ description: 'Whether the rule is active.', default: true })
  @IsOptional() @Transform(booleanValue) @IsBoolean() isActive = true;
}

/** Backwards-compatible name retained for the original scaffold import. */
export class WarehousesRequestDto extends WarehouseCreateDto {}
