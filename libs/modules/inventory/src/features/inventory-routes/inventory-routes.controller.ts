import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InventoryRoutesHandler } from './inventory-routes.handler';
import {
  ExpireReservationsDto,
  InventoryAdjustmentDto,
  InventoryHoldDto,
  InventoryListQueryDto,
  InventoryLotCreateDto,
  InventoryRelocationDto,
  InventoryReservationDto,
  StockTransferCreateDto,
  StockTransferReceiveDto,
} from './inventory-routes.schema';

const actor = (value?: string): string | undefined => value?.trim() || undefined;

@ApiTags('inventory')
@Controller({ version: '1' })
export class InventoryRoutesController {
  constructor(private readonly handler: InventoryRoutesHandler) {}

  @Get('product-inventory')
  listInventory(@Query() query: InventoryListQueryDto) {
    return this.handler.execute('list-inventory', query);
  }

  @Get('product-inventory/lots')
  listLots(@Query() query: InventoryListQueryDto) {
    return this.handler.execute('list-lots', query);
  }

  @Post('product-inventory/lots')
  @HttpCode(HttpStatus.CREATED)
  createLot(@Body() body: InventoryLotCreateDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('create-lot', body, actor(user));
  }

  @Post('product-inventory/adjustments')
  adjust(@Body() body: InventoryAdjustmentDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('adjust', body, actor(user));
  }

  @Post('product-inventory/reservations')
  @HttpCode(HttpStatus.CREATED)
  reserve(@Body() body: InventoryReservationDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('reserve', body, actor(user));
  }

  @Post('product-inventory/reservations/expire')
  expire(@Body() body: ExpireReservationsDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('expire-reservations', body, actor(user));
  }

  @Post('product-inventory/reservations/:reservationId/release')
  release(
    @Param('reservationId', new ParseUUIDPipe()) reservationId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('release-reservation', { reservationId }, actor(user));
  }

  @Post('product-inventory/reservations/:reservationId/commit')
  commit(
    @Param('reservationId', new ParseUUIDPipe()) reservationId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('commit-reservation', { reservationId }, actor(user));
  }

  @Post('product-inventory/holds')
  @HttpCode(HttpStatus.CREATED)
  createHold(@Body() body: InventoryHoldDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('create-hold', body, actor(user));
  }

  @Post('product-inventory/holds/:holdId/release')
  releaseHold(
    @Param('holdId', new ParseUUIDPipe()) holdId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('release-hold', { holdId }, actor(user));
  }

  @Get('product-locations')
  listLocations(@Query() query: InventoryListQueryDto) {
    return this.handler.execute('list-locations', query);
  }

  @Post('product-locations/relocate')
  relocate(@Body() body: InventoryRelocationDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('relocate', body, actor(user));
  }

  @Post('stock-transfers')
  @HttpCode(HttpStatus.CREATED)
  createTransfer(@Body() body: StockTransferCreateDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('create-transfer', body, actor(user));
  }

  @Get('stock-transfers/:transferId')
  getTransfer(@Param('transferId', new ParseUUIDPipe()) transferId: string) {
    return this.handler.execute('get-transfer', { transferId });
  }

  @Post('stock-transfers/:transferId/dispatch')
  dispatchTransfer(
    @Param('transferId', new ParseUUIDPipe()) transferId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('dispatch-transfer', { transferId }, actor(user));
  }

  @Post('stock-transfers/:transferId/receive')
  receiveTransfer(
    @Param('transferId', new ParseUUIDPipe()) transferId: string,
    @Body() body: StockTransferReceiveDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('receive-transfer', { transferId, ...body }, actor(user));
  }

  @Get('products/:productId/inventory')
  productInventory(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.handler.execute('product-inventory', { productId, warehouseId });
  }

  @Get('products/:productId/warehouses')
  productWarehouses(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return this.handler.execute('product-warehouses', { productId });
  }

  @Get('warehouses/:warehouseId/inventory')
  warehouseInventory(
    @Param('warehouseId', new ParseUUIDPipe()) warehouseId: string,
    @Query() query: InventoryListQueryDto,
  ) {
    return this.handler.execute('warehouse-inventory', { ...query, warehouseId });
  }

  @Get('warehouses/:warehouseId/products')
  warehouseProducts(
    @Param('warehouseId', new ParseUUIDPipe()) warehouseId: string,
    @Query() query: InventoryListQueryDto,
  ) {
    return this.handler.execute('warehouse-products', { ...query, warehouseId });
  }
}
