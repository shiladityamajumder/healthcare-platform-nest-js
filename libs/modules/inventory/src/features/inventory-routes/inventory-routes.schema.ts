import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

const booleanValue = ({ value }: { value: unknown }): unknown => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

export class InventoryListQueryDto {
  @IsOptional() @IsUUID() productId?: string;
  @IsOptional() @IsUUID() variantId?: string;
  @IsOptional() @IsUUID() warehouseId?: string;
  @IsOptional() @IsString() @MaxLength(16) qualityStatus?: string;
  @IsOptional() @Transform(booleanValue) @IsBoolean() inStock?: boolean;
  @IsOptional() @Transform(booleanValue) @IsBoolean() lowStock?: boolean;
  @IsOptional() @Transform(booleanValue) @IsBoolean() expiringSoon?: boolean;
  @IsOptional() @Transform(booleanValue) @IsBoolean() expired?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(730) expiryDays = 90;
  @IsOptional() @IsString() @MaxLength(200) search?: string;
  @IsOptional() @IsString() sortBy = 'productName';
  @IsOptional() @IsString() sortOrder: 'asc' | 'desc' = 'asc';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize = 20;
}

export class InventoryLotCreateDto {
  @IsUUID() warehouseId!: string;
  @IsUUID() productId!: string;
  @IsOptional() @IsUUID() variantId?: string;
  @IsUUID() binId!: string;
  @IsOptional() @IsUUID() supplierId?: string;
  @IsOptional() @IsUUID() goodsReceiptItemId?: string;
  @IsString() @MinLength(1) @MaxLength(128) batchNumber!: string;
  @IsOptional() @IsDateString() manufacturedAt?: string;
  @IsDateString() expiresAt!: string;
  @IsOptional() @IsNumberString() purchaseCost?: string;
  @IsNumberString() mrp!: string;
  @IsOptional() @IsString() @MaxLength(16) qualityStatus = 'pending';
  @IsString() @MinLength(1) @MaxLength(32) recallStatus = 'clear';
  @IsOptional() @Type(() => Date) @IsDate() receivedAt?: Date;
  @IsOptional() @IsNumberString() initialQuantity = '0';
  @IsString() @MinLength(8) @MaxLength(128) idempotencyKey!: string;
}

export class InventoryAdjustmentDto {
  @IsUUID() warehouseId!: string;
  @IsUUID() binId!: string;
  @IsUUID() lotId!: string;
  @IsNumberString() quantityDelta!: string;
  @IsString() @MinLength(1) @MaxLength(64) reasonCode!: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsUUID() referenceId?: string;
  @IsString() @MinLength(8) @MaxLength(128) idempotencyKey!: string;
}

export class InventoryReservationDto {
  @IsString() @MinLength(1) @MaxLength(64) reservationNumber!: string;
  @IsUUID() orderId!: string;
  @IsUUID() orderItemId!: string;
  @IsUUID() warehouseId!: string;
  @IsUUID() binId!: string;
  @IsUUID() lotId!: string;
  @IsNumberString() quantity!: string;
  @Type(() => Date) @IsDate() expiresAt!: Date;
}

export class ExpireReservationsDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(1000) limit = 100;
}

export class InventoryHoldDto {
  @IsUUID() warehouseId!: string;
  @IsUUID() binId!: string;
  @IsUUID() lotId!: string;
  @IsNumberString() quantity!: string;
  @IsString() @MinLength(1) @MaxLength(64) reasonCode!: string;
}

export class InventoryRelocationDto {
  @IsUUID() warehouseId!: string;
  @IsUUID() lotId!: string;
  @IsUUID() sourceBinId!: string;
  @IsUUID() destinationBinId!: string;
  @IsNumberString() quantity!: string;
  @IsOptional() @IsUUID() referenceId?: string;
  @IsString() @MinLength(8) @MaxLength(128) idempotencyKey!: string;
}

export class StockTransferItemDto {
  @IsUUID() lotId!: string;
  @IsNumberString() requestedQuantity!: string;
}

export class StockTransferCreateDto {
  @IsString() @MinLength(1) @MaxLength(64) transferNumber!: string;
  @IsUUID() sourceWarehouseId!: string;
  @IsUUID() destinationWarehouseId!: string;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ArrayUnique((item: StockTransferItemDto) => item.lotId)
  @ValidateNested({ each: true })
  @Type(() => StockTransferItemDto)
  items!: StockTransferItemDto[];
}

export class StockTransferReceiveItemDto {
  @IsUUID() transferItemId!: string;
  @IsUUID() destinationBinId!: string;
  @IsNumberString() receivedQuantity!: string;
}

export class StockTransferReceiveDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => StockTransferReceiveItemDto)
  items!: StockTransferReceiveItemDto[];
  @IsString() @MinLength(8) @MaxLength(128) idempotencyKey!: string;
}
