// * Inventory module: Defines validated request and query contracts for stock workflows.
// * File: src/features/inventory-routes/inventory-routes.schema.ts
// ? Keep transport DTOs independent from database row interfaces.
// ! Validation here protects the HTTP boundary; business invariants remain in InventoryService.
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

/** Filters and paginates inventory balance or lot listings. */
export class InventoryListQueryDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter stock for one catalog product.' })
  @IsOptional()
  @IsUUID()
  productId?: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter stock for one product variant.' })
  @IsOptional()
  @IsUUID()
  variantId?: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter stock in one warehouse.' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;
  @ApiPropertyOptional({
    description: 'Lot quality state, such as pending, approved, or quarantined.',
    example: 'approved',
  })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  qualityStatus?: string;
  @ApiPropertyOptional({
    description: 'When true, return only balances with available stock.',
    example: true,
  })
  @IsOptional()
  @Transform(booleanValue)
  @IsBoolean()
  inStock?: boolean;
  @ApiPropertyOptional({
    description: 'When true, return stock at or below its replenishment minimum.',
    example: true,
  })
  @IsOptional()
  @Transform(booleanValue)
  @IsBoolean()
  lowStock?: boolean;
  @ApiPropertyOptional({
    description: 'When true, return lots expiring within expiryDays.',
    example: true,
  })
  @IsOptional()
  @Transform(booleanValue)
  @IsBoolean()
  expiringSoon?: boolean;
  @ApiPropertyOptional({
    description: 'When true, return lots whose expiry date has passed.',
    example: false,
  })
  @IsOptional()
  @Transform(booleanValue)
  @IsBoolean()
  expired?: boolean;
  @ApiPropertyOptional({
    description: 'Number of days used by expiringSoon.',
    default: 90,
    minimum: 1,
    maximum: 730,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(730)
  expiryDays = 90;
  @ApiPropertyOptional({
    description: 'Search product name, SKU, or batch number.',
    example: 'paracetamol',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
  @ApiPropertyOptional({
    description: 'Allowed sort key.',
    enum: ['productName', 'expiresAt', 'availableQty', 'updatedAt'],
    default: 'productName',
  })
  @IsOptional()
  @IsString()
  sortBy = 'productName';
  @ApiPropertyOptional({ description: 'Sort direction.', enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  @IsString()
  sortOrder: 'asc' | 'desc' = 'asc';
  @ApiPropertyOptional({ description: 'One-based page number.', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;
  @ApiPropertyOptional({
    description: 'Maximum number of records per page.',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;
}

/** Registers a product lot and optional initial receipt quantity. */
export class InventoryLotCreateDto {
  @ApiProperty({ format: 'uuid', description: 'Warehouse that owns the lot.' })
  @IsUUID()
  warehouseId!: string;
  @ApiProperty({ format: 'uuid', description: 'Catalog product represented by the lot.' })
  @IsUUID()
  productId!: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Optional product variant.' })
  @IsOptional()
  @IsUUID()
  variantId?: string;
  @ApiProperty({ format: 'uuid', description: 'Receiving bin where the initial stock is placed.' })
  @IsUUID()
  binId!: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Supplier associated with the lot.' })
  @IsOptional()
  @IsUUID()
  supplierId?: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Goods-receipt item that created the lot.' })
  @IsOptional()
  @IsUUID()
  goodsReceiptItemId?: string;
  @ApiProperty({
    description: 'Supplier/manufacturer batch identifier.',
    example: 'BATCH-2026-001',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  batchNumber!: string;
  @ApiPropertyOptional({
    format: 'date',
    description: 'Manufacturing date in ISO date format.',
    example: '2026-01-15',
  })
  @IsOptional()
  @IsDateString()
  manufacturedAt?: string;
  @ApiProperty({
    format: 'date',
    description: 'Expiry date in ISO date format.',
    example: '2028-01-15',
  })
  @IsDateString()
  expiresAt!: string;
  @ApiPropertyOptional({ description: 'Purchase cost as a decimal string.', example: '42.50' })
  @IsOptional()
  @IsNumberString()
  purchaseCost?: string;
  @ApiProperty({ description: 'Maximum retail price as a decimal string.', example: '59.99' })
  @IsNumberString()
  mrp!: string;
  @ApiPropertyOptional({
    description: 'Quality state assigned to the lot.',
    default: 'pending',
    example: 'pending',
  })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  qualityStatus = 'pending';
  @ApiProperty({
    description: 'Recall state assigned to the lot.',
    default: 'clear',
    example: 'clear',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  recallStatus = 'clear';
  @ApiPropertyOptional({ format: 'date-time', description: 'Timestamp when the lot was received.' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  receivedAt?: Date;
  @ApiPropertyOptional({
    description: 'Initial on-hand quantity as a decimal string.',
    default: '0',
    example: '100',
  })
  @IsOptional()
  @IsNumberString()
  initialQuantity = '0';
  @ApiProperty({
    description: 'Client idempotency key for safe retry of receipt creation.',
    example: 'goods-receipt-2026-001',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  idempotencyKey!: string;
}

/** Mutable lot fields used by quality, recall, and commercial operations. */
export class InventoryLotUpdateDto {
  @ApiPropertyOptional({
    description: 'Updated purchase cost as a decimal string.',
    example: '43.00',
  })
  @IsOptional()
  @IsNumberString()
  purchaseCost?: string;
  @ApiPropertyOptional({
    description: 'Updated maximum retail price as a decimal string.',
    example: '60.00',
  })
  @IsOptional()
  @IsNumberString()
  mrp?: string;
  @ApiPropertyOptional({ description: 'Updated quality state.', example: 'approved' })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  qualityStatus?: string;
  @ApiPropertyOptional({ description: 'Updated recall state.', example: 'clear' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  recallStatus?: string;
  @ApiProperty({
    description: 'Current row version used for optimistic locking.',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rowVersion!: number;
}

/** Requests a signed, auditable on-hand quantity adjustment. */
export class InventoryAdjustmentDto {
  @ApiProperty({ format: 'uuid', description: 'Warehouse containing the adjusted stock.' })
  @IsUUID()
  warehouseId!: string;
  @ApiProperty({ format: 'uuid', description: 'Bin containing the adjusted stock.' })
  @IsUUID()
  binId!: string;
  @ApiProperty({ format: 'uuid', description: 'Lot whose on-hand quantity changes.' })
  @IsUUID()
  lotId!: string;
  @ApiProperty({
    description: 'Signed quantity delta. Positive adds stock; negative removes stock.',
    example: '5.000',
  })
  @IsNumberString()
  quantityDelta!: string;
  @ApiProperty({
    description: 'Business reason for the adjustment.',
    example: 'damaged_stock_correction',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  reasonCode!: string;
  @ApiPropertyOptional({ description: 'Operator note explaining the adjustment.' })
  @IsOptional()
  @IsString()
  notes?: string;
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Optional external document or order reference.',
  })
  @IsOptional()
  @IsUUID()
  referenceId?: string;
  @ApiProperty({
    description: 'Client idempotency key. Retrying the same key does not post twice.',
    example: 'adjustment-scan-2026-001',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  idempotencyKey!: string;
}

/** Reserves available stock for an order item until the supplied expiry time. */
export class InventoryReservationDto {
  @ApiProperty({ description: 'Business-visible reservation number.', example: 'RES-2026-0001' })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  reservationNumber!: string;
  @ApiProperty({ format: 'uuid', description: 'Order being reserved.' })
  @IsUUID()
  orderId!: string;
  @ApiProperty({ format: 'uuid', description: 'Order line being reserved.' })
  @IsUUID()
  orderItemId!: string;
  @ApiProperty({ format: 'uuid', description: 'Warehouse from which stock is reserved.' })
  @IsUUID()
  warehouseId!: string;
  @ApiProperty({ format: 'uuid', description: 'Bin from which stock is reserved.' })
  @IsUUID()
  binId!: string;
  @ApiProperty({ format: 'uuid', description: 'Lot from which stock is reserved.' })
  @IsUUID()
  lotId!: string;
  @ApiProperty({ description: 'Quantity to reserve as a decimal string.', example: '2.000' })
  @IsNumberString()
  quantity!: string;
  @ApiProperty({
    format: 'date-time',
    description: 'Time after which an active reservation can be expired.',
  })
  @Type(() => Date)
  @IsDate()
  expiresAt!: Date;
}

/** Controls the batch size for reservation expiry processing. */
export class ExpireReservationsDto {
  @ApiPropertyOptional({
    description: 'Maximum number of expired reservations to process.',
    default: 100,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit = 100;
}

/** Places available stock into an operational quarantine hold. */
export class InventoryHoldDto {
  @ApiProperty({ format: 'uuid', description: 'Warehouse containing the stock.' })
  @IsUUID()
  warehouseId!: string;
  @ApiProperty({ format: 'uuid', description: 'Bin containing the stock.' })
  @IsUUID()
  binId!: string;
  @ApiProperty({ format: 'uuid', description: 'Lot placed on hold.' })
  @IsUUID()
  lotId!: string;
  @ApiProperty({
    description: 'Quantity to quarantine/hold as a decimal string.',
    example: '1.000',
  })
  @IsNumberString()
  quantity!: string;
  @ApiProperty({ description: 'Business reason for the hold.', example: 'quality_review' })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  reasonCode!: string;
}

/** Moves a lot quantity between two bins in one warehouse. */
export class InventoryRelocationDto {
  @ApiProperty({ format: 'uuid', description: 'Warehouse in which the relocation occurs.' })
  @IsUUID()
  warehouseId!: string;
  @ApiProperty({ format: 'uuid', description: 'Lot being moved.' })
  @IsUUID()
  lotId!: string;
  @ApiProperty({ format: 'uuid', description: 'Current source bin.' })
  @IsUUID()
  sourceBinId!: string;
  @ApiProperty({ format: 'uuid', description: 'Destination bin.' })
  @IsUUID()
  destinationBinId!: string;
  @ApiProperty({ description: 'Quantity to move as a decimal string.', example: '10.000' })
  @IsNumberString()
  quantity!: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Optional external relocation reference.' })
  @IsOptional()
  @IsUUID()
  referenceId?: string;
  @ApiProperty({
    description: 'Client idempotency key for safe retry.',
    example: 'bin-relocation-2026-001',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  idempotencyKey!: string;
}

/** Describes one lot quantity requested in a warehouse transfer. */
export class StockTransferItemDto {
  @ApiProperty({ format: 'uuid', description: 'Lot to transfer.' })
  @IsUUID()
  lotId!: string;
  @ApiProperty({
    description: 'Quantity requested for transfer as a decimal string.',
    example: '25.000',
  })
  @IsNumberString()
  requestedQuantity!: string;
}

/** Creates a warehouse-to-warehouse stock transfer request. */
export class StockTransferCreateDto {
  @ApiProperty({ description: 'Business-visible transfer number.', example: 'TRF-2026-0001' })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  transferNumber!: string;
  @ApiProperty({ format: 'uuid', description: 'Warehouse sending stock.' })
  @IsUUID()
  sourceWarehouseId!: string;
  @ApiProperty({ format: 'uuid', description: 'Warehouse receiving stock.' })
  @IsUUID()
  destinationWarehouseId!: string;
  @ApiProperty({
    type: () => [StockTransferItemDto],
    description: 'Lots and quantities included in the transfer.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ArrayUnique((item: StockTransferItemDto) => item.lotId)
  @ValidateNested({ each: true })
  @Type(() => StockTransferItemDto)
  items!: StockTransferItemDto[];
}

/** Describes one physically received transfer line. */
export class StockTransferReceiveItemDto {
  @ApiProperty({ format: 'uuid', description: 'Transfer-item UUID from the transfer response.' })
  @IsUUID()
  transferItemId!: string;
  @ApiProperty({ format: 'uuid', description: 'Destination bin receiving this lot.' })
  @IsUUID()
  destinationBinId!: string;
  @ApiProperty({
    description: 'Quantity physically received as a decimal string.',
    example: '25.000',
  })
  @IsNumberString()
  receivedQuantity!: string;
}

/** Records one or more received transfer lines idempotently. */
export class StockTransferReceiveDto {
  @ApiProperty({
    type: () => [StockTransferReceiveItemDto],
    description: 'Received quantities grouped by transfer item.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => StockTransferReceiveItemDto)
  items!: StockTransferReceiveItemDto[];
  @ApiProperty({
    description: 'Client idempotency key for safe receive retry.',
    example: 'transfer-receive-2026-001',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  idempotencyKey!: string;
}

/** Generic operational list filters shared by reservations, holds, ledger, and workflows. */
/** Shared filters for operational inventory lists and audit screens. */
export class InventoryOperationalListQueryDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter by warehouse.' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter transfers by source warehouse.' })
  @IsOptional()
  @IsUUID()
  sourceWarehouseId?: string;
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filter transfers by destination warehouse.',
  })
  @IsOptional()
  @IsUUID()
  destinationWarehouseId?: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter by lot.' })
  @IsOptional()
  @IsUUID()
  lotId?: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter reservations by order.' })
  @IsOptional()
  @IsUUID()
  orderId?: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter reservations by order item.' })
  @IsOptional()
  @IsUUID()
  orderItemId?: string;
  @ApiPropertyOptional({ description: 'Filter by lifecycle status.', example: 'active' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  status?: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter cycle counts by assigned operator.' })
  @IsOptional()
  @IsUUID()
  assignedToUserId?: string;
  @ApiPropertyOptional({ description: 'Filter adjustments by reason.', example: 'cycle_count' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  reasonCode?: string;
  @ApiPropertyOptional({
    description: 'Filter ledger entries by movement type.',
    example: 'receipt',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  movementType?: string;
  @ApiPropertyOptional({
    description: 'Filter ledger entries by reference type.',
    example: 'stock_transfer',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  referenceType?: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter ledger entries by reference UUID.' })
  @IsOptional()
  @IsUUID()
  referenceId?: string;
  @ApiPropertyOptional({
    format: 'date-time',
    description: 'Include ledger entries on or after this time.',
  })
  @IsOptional()
  @IsDateString()
  from?: string;
  @ApiPropertyOptional({
    format: 'date-time',
    description: 'Include ledger entries before this time.',
  })
  @IsOptional()
  @IsDateString()
  until?: string;
  @ApiPropertyOptional({ description: 'One-based page number.', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;
  @ApiPropertyOptional({
    description: 'Maximum records per page.',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;
}

/** Starts a count session for one warehouse or one bin. */
export class CycleCountCreateDto {
  @ApiProperty({ format: 'uuid', description: 'Warehouse to count.' })
  @IsUUID()
  warehouseId!: string;
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Optional bin scope. If omitted, the count covers the warehouse.',
  })
  @IsOptional()
  @IsUUID()
  binId?: string;
  @ApiPropertyOptional({ format: 'date-time', description: 'Planned count time.' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledAt?: Date;
  @ApiPropertyOptional({ format: 'uuid', description: 'Operator assigned to perform the count.' })
  @IsOptional()
  @IsUUID()
  assignedToUserId?: string;
  @ApiPropertyOptional({ description: 'Counting mode.', default: 'full', example: 'full' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  countMode = 'full';
}

/** Adds one lot/bin line to a cycle-count session. */
export class CycleCountItemCreateDto {
  @ApiProperty({ format: 'uuid', description: 'Cycle-count session receiving the line.' })
  @IsUUID()
  cycleCountId!: string;
  @ApiProperty({ format: 'uuid', description: 'Bin being counted.' })
  @IsUUID()
  binId!: string;
  @ApiProperty({ format: 'uuid', description: 'Lot being counted.' })
  @IsUUID()
  lotId!: string;
  @ApiPropertyOptional({
    description: 'Reason associated with an expected variance.',
    example: 'manual_review',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  reasonCode?: string;
}

/** Records the physical quantity counted for one cycle-count line. */
export class CycleCountItemUpdateDto {
  @ApiProperty({ format: 'uuid', description: 'Cycle-count session containing the line.' })
  @IsUUID()
  cycleCountId!: string;
  @ApiProperty({ format: 'uuid', description: 'Cycle-count item UUID.' })
  @IsUUID()
  itemId!: string;
  @ApiProperty({
    description: 'Physically counted quantity as a decimal string.',
    example: '98.000',
  })
  @IsNumberString()
  countedQty!: string;
  @ApiPropertyOptional({
    description: 'Reason for the counted variance.',
    example: 'damaged_stock',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  reasonCode?: string;
}

/** Changes the lifecycle or schedule of a cycle-count session. */
export class CycleCountUpdateDto {
  @ApiProperty({ format: 'uuid', description: 'Cycle-count session UUID.' })
  @IsUUID()
  cycleCountId!: string;
  @ApiPropertyOptional({ description: 'New count lifecycle state.', example: 'completed' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  status?: string;
  @ApiPropertyOptional({ format: 'date-time', description: 'Time counting started.' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startedAt?: Date;
  @ApiPropertyOptional({
    format: 'date-time',
    description: 'Time counting completed. Completing a count posts recorded variances.',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedAt?: Date;
  @ApiProperty({
    description: 'Current row version used for optimistic locking.',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rowVersion!: number;
}
