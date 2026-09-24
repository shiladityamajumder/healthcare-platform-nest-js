import {
  Body,
  Controller,
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
import { InventoryRoutesHandler } from './inventory-routes.handler';
// * Inventory module: Exposes inventory, stock, transfer, and cycle-count HTTP endpoints.
// * File: src/features/inventory-routes/inventory-routes.controller.ts
// ? Keep request validation and API metadata at the HTTP boundary.
// ! Business rules and persistence remain in InventoryService and its repository port.
import {
  ApiInventoryActorHeader,
  ApiInventoryBody,
  ApiInventoryErrors,
  ApiInventoryOperation,
  ApiInventoryPaginatedResponse,
  ApiInventoryQuery,
  ApiInventoryQueryParam,
  ApiInventoryResponse,
  ApiInventoryUuidParam,
} from '../../contracts/swagger';
import {
  ExpireReservationsDto,
  InventoryAdjustmentDto,
  InventoryHoldDto,
  InventoryListQueryDto,
  InventoryLotCreateDto,
  InventoryLotUpdateDto,
  InventoryOperationalListQueryDto,
  InventoryRelocationDto,
  InventoryReservationDto,
  CycleCountCreateDto,
  CycleCountItemCreateDto,
  CycleCountItemUpdateDto,
  CycleCountUpdateDto,
  StockTransferCreateDto,
  StockTransferReceiveDto,
} from './inventory-routes.schema';

const actor = (value?: string): string | undefined => value?.trim() || undefined;

@ApiTags('inventory')
@Controller({ version: '1' })
@ApiInventoryErrors()
export class InventoryRoutesController {
  // * Function [constructor]: Initializes the controller with the inventory route handler.
  constructor(private readonly handler: InventoryRoutesHandler) {}

  @Get('product-inventory')
  @ApiInventoryOperation('List inventory balances', 'Returns paginated stock balances by product, variant, warehouse, lot, quality, expiry, availability, and low-stock filters for catalogue pages, fulfilment, and operations dashboards.')
  @ApiInventoryQuery(InventoryListQueryDto, 'Optional product, warehouse, availability, expiry, search, sorting, and pagination filters.')
  @ApiInventoryPaginatedResponse('Inventory balances returned.', { items: [{ warehouseId: '550e8400-e29b-41d4-a716-446655440000', lotId: '550e8400-e29b-41d4-a716-446655440001', availableQty: '98.000', productName: 'Paracetamol 500mg' }] })
  // * Function [listInventory]: Returns filtered and paginated inventory balances.
  listInventory(@Query() query: InventoryListQueryDto) {
    return this.handler.execute('list-inventory', query);
  }

  @Get('product-inventory/lots')
  @ApiInventoryOperation('List inventory lots', 'Returns lot-level stock and expiry information, including lots with zero balance so receiving, quarantine, and quality workflows can still display them.')
  @ApiInventoryQuery(InventoryListQueryDto, 'Optional product, warehouse, quality, expiry, availability, search, sorting, and pagination filters.')
  @ApiInventoryPaginatedResponse('Inventory lots returned.', { items: [{ id: '550e8400-e29b-41d4-a716-446655440001', batchNumber: 'BATCH-2026-001', expiresAt: '2028-01-15', availableQty: '100.000' }] })
  // * Function [listLots]: Returns lot-level stock, expiry, and quality information.
  listLots(@Query() query: InventoryListQueryDto) {
    return this.handler.execute('list-lots', query);
  }

  @Post('product-inventory/lots')
  @HttpCode(HttpStatus.CREATED)
  @ApiInventoryOperation('Create an inventory lot', 'Registers a product batch in a warehouse and optionally posts its initial receipt quantity into the stock balance and ledger.')
  @ApiInventoryBody(InventoryLotCreateDto, 'Warehouse, product, batch, expiry, pricing, quality, and initial quantity details.')
  @ApiInventoryResponse('Inventory lot created.', { id: '550e8400-e29b-41d4-a716-446655440001', batchNumber: 'BATCH-2026-001', qualityStatus: 'pending' }, HttpStatus.CREATED)
  @ApiInventoryActorHeader()
  // * Function [createLot]: Registers an inventory lot and optional initial receipt quantity.
  createLot(@Body() body: InventoryLotCreateDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('create-lot', body, actor(user));
  }

  @Get('product-inventory/lots/:lotId')
  @ApiInventoryOperation('Get an inventory lot', 'Returns one lot so frontend quality, expiry, recall, and receiving screens can display its current metadata.')
  @ApiInventoryUuidParam('lotId', 'Inventory-lot UUID to retrieve.')
  @ApiInventoryResponse('Inventory lot returned.', { id: '550e8400-e29b-41d4-a716-446655440001', batchNumber: 'BATCH-2026-001', mrp: '59.99', rowVersion: 1 })
  // * Function [getLot]: Returns one inventory lot by UUID.
  getLot(@Param('lotId', new ParseUUIDPipe()) lotId: string) {
    return this.handler.execute('get-lot', { lotId });
  }

  @Patch('product-inventory/lots/:lotId')
  @ApiInventoryOperation('Update an inventory lot', 'Updates mutable commercial and quality fields using rowVersion so concurrent warehouse edits are not silently overwritten.')
  @ApiInventoryUuidParam('lotId', 'Inventory-lot UUID to update.')
  @ApiInventoryBody(InventoryLotUpdateDto, 'Mutable lot fields and the current rowVersion.')
  @ApiInventoryResponse('Inventory lot updated.', { id: '550e8400-e29b-41d4-a716-446655440001', qualityStatus: 'approved', rowVersion: 2 })
  @ApiInventoryActorHeader()
  // * Function [updateLot]: Updates mutable lot metadata using optimistic locking.
  updateLot(
    @Param('lotId', new ParseUUIDPipe()) lotId: string,
    @Body() body: InventoryLotUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('update-lot', { lotId, ...body }, actor(user));
  }

  @Post('product-inventory/adjustments')
  @ApiInventoryOperation('Post an inventory adjustment', 'Adds or removes on-hand quantity for a lot/bin, records the adjustment reason, and writes an auditable stock-ledger movement.')
  @ApiInventoryBody(InventoryAdjustmentDto, 'Warehouse, bin, lot, signed quantity delta, reason, note, and idempotency key.')
  @ApiInventoryResponse('Inventory adjustment posted.', { adjustmentNumber: 'ADJ-2026-001', balance: { onHandQty: '105.000' } }, HttpStatus.CREATED)
  @ApiInventoryActorHeader()
  // * Function [adjust]: Posts a signed inventory adjustment.
  adjust(@Body() body: InventoryAdjustmentDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('adjust', body, actor(user));
  }

  @Get('product-inventory/adjustments')
  @ApiInventoryOperation('List inventory adjustments', 'Returns adjustment headers for warehouse audit, reconciliation, and operator review.')
  @ApiInventoryQuery(InventoryOperationalListQueryDto, 'Optional warehouse, status, reason, and pagination filters.')
  @ApiInventoryPaginatedResponse('Inventory adjustments returned.', { items: [{ id: '550e8400-e29b-41d4-a716-446655440002', status: 'posted', reasonCode: 'cycle_count' }] })
  // * Function [listAdjustments]: Lists inventory adjustment headers.
  listAdjustments(@Query() query: InventoryOperationalListQueryDto) {
    return this.handler.execute('list-adjustments', query);
  }

  @Get('product-inventory/adjustments/:adjustmentId')
  @ApiInventoryOperation('Get an inventory adjustment', 'Returns one adjustment header with its line items for audit details and reconciliation.')
  @ApiInventoryUuidParam('adjustmentId', 'Inventory-adjustment UUID to retrieve.')
  @ApiInventoryResponse('Inventory adjustment returned.', { id: '550e8400-e29b-41d4-a716-446655440002', items: [{ lotId: '550e8400-e29b-41d4-a716-446655440001', quantityDelta: '-2.000' }] })
  // * Function [getAdjustment]: Returns an adjustment with its line items.
  getAdjustment(@Param('adjustmentId', new ParseUUIDPipe()) adjustmentId: string) {
    return this.handler.execute('get-adjustment', { adjustmentId });
  }

  @Post('product-inventory/reservations')
  @HttpCode(HttpStatus.CREATED)
  @ApiInventoryOperation('Reserve stock for an order', 'Moves available stock into reserved quantity for an order line so checkout or fulfilment can safely claim it before commitment.')
  @ApiInventoryBody(InventoryReservationDto, 'Order, warehouse, bin, lot, quantity, reservation number, and expiry timestamp.')
  @ApiInventoryResponse('Stock reservation created.', { id: '550e8400-e29b-41d4-a716-446655440003', status: 'active', quantity: '2.000' }, HttpStatus.CREATED)
  @ApiInventoryActorHeader()
  // * Function [reserve]: Reserves available stock for an order line.
  reserve(@Body() body: InventoryReservationDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('reserve', body, actor(user));
  }

  @Get('product-inventory/reservations')
  @ApiInventoryOperation('List stock reservations', 'Returns reservations for order tracking, fulfilment monitoring, expiry jobs, and inventory reconciliation.')
  @ApiInventoryQuery(InventoryOperationalListQueryDto, 'Optional warehouse, order, lot, status, and pagination filters.')
  @ApiInventoryPaginatedResponse('Stock reservations returned.', { items: [{ id: '550e8400-e29b-41d4-a716-446655440003', reservationNumber: 'RES-2026-0001', status: 'active', quantity: '2.000' }] })
  // * Function [listReservations]: Lists reservations for order and fulfilment workflows.
  listReservations(@Query() query: InventoryOperationalListQueryDto) {
    return this.handler.execute('list-reservations', query);
  }

  @Get('product-inventory/reservations/:reservationId')
  @ApiInventoryOperation('Get a stock reservation', 'Returns one reservation and its lifecycle state for order and fulfilment screens.')
  @ApiInventoryUuidParam('reservationId', 'Stock-reservation UUID to retrieve.')
  @ApiInventoryResponse('Stock reservation returned.', { id: '550e8400-e29b-41d4-a716-446655440003', status: 'active', expiresAt: '2026-09-24T12:00:00.000Z' })
  // * Function [getReservation]: Returns one stock reservation.
  getReservation(@Param('reservationId', new ParseUUIDPipe()) reservationId: string) {
    return this.handler.execute('get-reservation', { reservationId });
  }

  @Post('product-inventory/reservations/expire')
  @ApiInventoryOperation('Expire stock reservations', 'Releases active reservations whose expiry has passed and restores their reserved quantity to available stock. This endpoint is intended for a scheduled worker or controlled admin action.')
  @ApiInventoryBody(ExpireReservationsDto, 'Maximum number of expired reservations to process in this transaction.')
  @ApiInventoryResponse('Expired reservations processed.', { items: [], pagination: { totalCount: 0, limit: 100, offset: 0, hasNext: false } })
  @ApiInventoryActorHeader()
  // * Function [expire]: Releases reservations whose expiry time has passed.
  expire(@Body() body: ExpireReservationsDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('expire-reservations', body, actor(user));
  }

  @Post('product-inventory/reservations/:reservationId/release')
  @ApiInventoryOperation('Release a stock reservation', 'Releases an active reservation when an order is cancelled or no longer needs the held stock.')
  @ApiInventoryUuidParam('reservationId', 'Stock-reservation UUID to release.')
  @ApiInventoryResponse('Stock reservation released.', { id: '550e8400-e29b-41d4-a716-446655440003', status: 'released' })
  @ApiInventoryActorHeader()
  // * Function [release]: Releases one active reservation without consuming stock.
  release(
    @Param('reservationId', new ParseUUIDPipe()) reservationId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('release-reservation', { reservationId }, actor(user));
  }

  @Post('product-inventory/reservations/:reservationId/commit')
  @ApiInventoryOperation('Commit a stock reservation', 'Consumes the reserved on-hand quantity when an order progresses to a committed fulfilment state.')
  @ApiInventoryUuidParam('reservationId', 'Stock-reservation UUID to commit.')
  @ApiInventoryResponse('Stock reservation committed.', { id: '550e8400-e29b-41d4-a716-446655440003', status: 'committed' })
  @ApiInventoryActorHeader()
  // * Function [commit]: Commits one active reservation and consumes its stock.
  commit(
    @Param('reservationId', new ParseUUIDPipe()) reservationId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('commit-reservation', { reservationId }, actor(user));
  }

  @Post('product-inventory/holds')
  @HttpCode(HttpStatus.CREATED)
  @ApiInventoryOperation('Place an inventory hold', 'Moves available quantity into quarantined quantity for quality review, recall handling, investigation, or another operational reason.')
  @ApiInventoryBody(InventoryHoldDto, 'Warehouse, bin, lot, quantity, and hold reason.')
  @ApiInventoryResponse('Inventory hold created.', { id: '550e8400-e29b-41d4-a716-446655440004', status: 'active', quantity: '1.000' }, HttpStatus.CREATED)
  @ApiInventoryActorHeader()
  // * Function [createHold]: Places available stock into an operational hold.
  createHold(@Body() body: InventoryHoldDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('create-hold', body, actor(user));
  }

  @Get('product-inventory/holds')
  @ApiInventoryOperation('List inventory holds', 'Returns active and historical holds so operations and quality teams can monitor quarantined stock.')
  @ApiInventoryQuery(InventoryOperationalListQueryDto, 'Optional warehouse, lot, status, and pagination filters.')
  @ApiInventoryPaginatedResponse('Inventory holds returned.', { items: [{ id: '550e8400-e29b-41d4-a716-446655440004', status: 'active', reasonCode: 'quality_review' }] })
  // * Function [listHolds]: Lists active and historical inventory holds.
  listHolds(@Query() query: InventoryOperationalListQueryDto) {
    return this.handler.execute('list-holds', query);
  }

  @Get('product-inventory/holds/:holdId')
  @ApiInventoryOperation('Get an inventory hold', 'Returns one hold and its current release state for quality and warehouse operations.')
  @ApiInventoryUuidParam('holdId', 'Inventory-hold UUID to retrieve.')
  @ApiInventoryResponse('Inventory hold returned.', { id: '550e8400-e29b-41d4-a716-446655440004', status: 'active', quantity: '1.000' })
  // * Function [getHold]: Returns one inventory hold by UUID.
  getHold(@Param('holdId', new ParseUUIDPipe()) holdId: string) {
    return this.handler.execute('get-hold', { holdId });
  }

  @Post('product-inventory/holds/:holdId/release')
  @ApiInventoryOperation('Release an inventory hold', 'Returns held quantity to available stock after the quality or operational review is complete.')
  @ApiInventoryUuidParam('holdId', 'Inventory-hold UUID to release.')
  @ApiInventoryResponse('Inventory hold released.', { id: '550e8400-e29b-41d4-a716-446655440004', status: 'released' })
  @ApiInventoryActorHeader()
  // * Function [releaseHold]: Releases a hold and restores its quantity to availability.
  releaseHold(
    @Param('holdId', new ParseUUIDPipe()) holdId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('release-hold', { holdId }, actor(user));
  }

  @Get('product-locations')
  @ApiInventoryOperation('List warehouse locations', 'Returns warehouse, zone, aisle, rack, and bin hierarchy so frontend warehouse screens can place stock in valid locations.')
  @ApiInventoryQuery(InventoryListQueryDto, 'Use warehouseId to limit the hierarchy to one warehouse.')
  @ApiInventoryResponse('Warehouse locations returned.', [{ warehouseId: '550e8400-e29b-41d4-a716-446655440000', zoneCode: 'COLD', binCode: 'COLD-A-01' }])
  // * Function [listLocations]: Returns the warehouse location hierarchy.
  listLocations(@Query() query: InventoryListQueryDto) {
    return this.handler.execute('list-locations', query);
  }

  @Post('product-locations/relocate')
  @ApiInventoryOperation('Relocate stock between bins', 'Moves available quantity between two bins in the same warehouse and writes paired relocation ledger entries.')
  @ApiInventoryBody(InventoryRelocationDto, 'Warehouse, lot, source bin, destination bin, quantity, reference, and idempotency key.')
  @ApiInventoryResponse('Stock relocated.', { message: 'Stock relocated successfully.' })
  @ApiInventoryActorHeader()
  // * Function [relocate]: Relocates stock between two bins.
  relocate(@Body() body: InventoryRelocationDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('relocate', body, actor(user));
  }

  @Get('product-inventory/ledger')
  @ApiInventoryOperation('List stock-ledger movements', 'Returns immutable stock movements for audit, reconciliation, support investigations, and inventory history screens.')
  @ApiInventoryQuery(InventoryOperationalListQueryDto, 'Optional warehouse, lot, movement, reference, time-window, and pagination filters.')
  @ApiInventoryPaginatedResponse('Stock-ledger movements returned.', { items: [{ movementType: 'receipt', quantity: '100.000', occurredAt: '2026-09-24T09:00:00.000Z' }] })
  // * Function [listLedger]: Lists immutable stock-ledger movements.
  listLedger(@Query() query: InventoryOperationalListQueryDto) {
    return this.handler.execute('list-ledger', query);
  }

  @Post('stock-transfers')
  @HttpCode(HttpStatus.CREATED)
  @ApiInventoryOperation('Create a stock transfer', 'Creates a requested transfer between warehouses with one or more lot quantities. The transfer is not deducted until dispatch.')
  @ApiInventoryBody(StockTransferCreateDto, 'Transfer number, source warehouse, destination warehouse, and requested lot quantities.')
  @ApiInventoryResponse('Stock transfer created.', { id: '550e8400-e29b-41d4-a716-446655440005', status: 'requested', items: [] }, HttpStatus.CREATED)
  @ApiInventoryActorHeader()
  // * Function [createTransfer]: Creates a warehouse-to-warehouse transfer request.
  createTransfer(@Body() body: StockTransferCreateDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('create-transfer', body, actor(user));
  }

  @Get('stock-transfers')
  @ApiInventoryOperation('List stock transfers', 'Returns transfer headers for warehouse-to-warehouse fulfilment monitoring and operational reconciliation.')
  @ApiInventoryQuery(InventoryOperationalListQueryDto, 'Optional source, destination, status, and pagination filters.')
  @ApiInventoryPaginatedResponse('Stock transfers returned.', { items: [{ id: '550e8400-e29b-41d4-a716-446655440005', transferNumber: 'TRF-2026-0001', status: 'dispatched' }] })
  // * Function [listTransfers]: Lists warehouse transfer headers.
  listTransfers(@Query() query: InventoryOperationalListQueryDto) {
    return this.handler.execute('list-transfers', query);
  }

  @Get('stock-transfers/:transferId')
  @ApiInventoryOperation('Get a stock transfer', 'Returns transfer header and line items so dispatch and receiving screens can show requested, dispatched, and received quantities.')
  @ApiInventoryUuidParam('transferId', 'Stock-transfer UUID to retrieve.')
  @ApiInventoryResponse('Stock transfer returned.', { id: '550e8400-e29b-41d4-a716-446655440005', status: 'dispatched', items: [{ requestedQty: '25.000', dispatchedQty: '25.000', receivedQty: '0.000' }] })
  // * Function [getTransfer]: Returns one transfer with its items.
  getTransfer(@Param('transferId', new ParseUUIDPipe()) transferId: string) {
    return this.handler.execute('get-transfer', { transferId });
  }

  @Post('stock-transfers/:transferId/dispatch')
  @ApiInventoryOperation('Dispatch a stock transfer', 'Allocates available stock from source bins, deducts it from source on-hand quantities, writes transfer-out ledger entries, and marks the transfer dispatched.')
  @ApiInventoryUuidParam('transferId', 'Stock-transfer UUID to dispatch.')
  @ApiInventoryResponse('Stock transfer dispatched.', { id: '550e8400-e29b-41d4-a716-446655440005', status: 'dispatched' })
  @ApiInventoryActorHeader()
  // * Function [dispatchTransfer]: Dispatches a transfer and deducts source stock.
  dispatchTransfer(
    @Param('transferId', new ParseUUIDPipe()) transferId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('dispatch-transfer', { transferId }, actor(user));
  }

  @Post('stock-transfers/:transferId/receive')
  @ApiInventoryOperation('Receive a stock transfer', 'Posts physically received quantities into destination bins, writes transfer-in ledger entries, and marks the transfer in transit or received.')
  @ApiInventoryUuidParam('transferId', 'Stock-transfer UUID to receive.')
  @ApiInventoryBody(StockTransferReceiveDto, 'Destination bins, received quantities, and receive idempotency key.')
  @ApiInventoryResponse('Stock transfer received.', { id: '550e8400-e29b-41d4-a716-446655440005', status: 'received' })
  @ApiInventoryActorHeader()
  // * Function [receiveTransfer]: Receives transfer quantities into destination bins.
  receiveTransfer(
    @Param('transferId', new ParseUUIDPipe()) transferId: string,
    @Body() body: StockTransferReceiveDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('receive-transfer', { transferId, ...body }, actor(user));
  }

  @Post('cycle-counts')
  @HttpCode(HttpStatus.CREATED)
  @ApiInventoryOperation('Create a cycle count', 'Creates a warehouse or bin counting session used to compare system stock with physical stock.')
  @ApiInventoryBody(CycleCountCreateDto, 'Warehouse scope, optional bin scope, schedule, assignee, and count mode.')
  @ApiInventoryResponse('Cycle count created.', { id: '550e8400-e29b-41d4-a716-446655440006', status: 'scheduled' }, HttpStatus.CREATED)
  @ApiInventoryActorHeader()
  // * Function [createCycleCount]: Creates a warehouse or bin cycle-count session.
  createCycleCount(@Body() body: CycleCountCreateDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('create-cycle-count', body, actor(user));
  }

  @Get('cycle-counts')
  @ApiInventoryOperation('List cycle counts', 'Returns scheduled, active, and completed count sessions for warehouse operations dashboards.')
  @ApiInventoryQuery(InventoryOperationalListQueryDto, 'Optional warehouse, status, assignee, and pagination filters.')
  @ApiInventoryPaginatedResponse('Cycle counts returned.', { items: [{ id: '550e8400-e29b-41d4-a716-446655440006', status: 'scheduled', countMode: 'full' }] })
  // * Function [listCycleCounts]: Lists cycle-count sessions.
  listCycleCounts(@Query() query: InventoryOperationalListQueryDto) {
    return this.handler.execute('list-cycle-counts', query);
  }

  @Get('cycle-counts/:cycleCountId')
  @ApiInventoryOperation('Get a cycle count', 'Returns one count session with its count lines and recorded variances.')
  @ApiInventoryUuidParam('cycleCountId', 'Cycle-count UUID to retrieve.')
  @ApiInventoryResponse('Cycle count returned.', { id: '550e8400-e29b-41d4-a716-446655440006', status: 'in_progress', items: [] })
  // * Function [getCycleCount]: Returns a cycle count and its lines.
  getCycleCount(@Param('cycleCountId', new ParseUUIDPipe()) cycleCountId: string) {
    return this.handler.execute('get-cycle-count', { cycleCountId });
  }

  @Patch('cycle-counts/:cycleCountId')
  @ApiInventoryOperation('Update a cycle count', 'Changes the count lifecycle or schedule using rowVersion. Marking a count completed posts its recorded variances to stock.')
  @ApiInventoryUuidParam('cycleCountId', 'Cycle-count UUID to update.')
  @ApiInventoryBody(CycleCountUpdateDto, 'Lifecycle fields and the current rowVersion.')
  @ApiInventoryResponse('Cycle count updated.', { id: '550e8400-e29b-41d4-a716-446655440006', status: 'completed', rowVersion: 2 })
  @ApiInventoryActorHeader()
  // * Function [updateCycleCount]: Updates count state and can post completion variances.
  updateCycleCount(
    @Param('cycleCountId', new ParseUUIDPipe()) cycleCountId: string,
    @Body() body: CycleCountUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('update-cycle-count', { ...body, cycleCountId }, actor(user));
  }

  @Post('cycle-counts/:cycleCountId/items')
  @HttpCode(HttpStatus.CREATED)
  @ApiInventoryOperation('Add a cycle-count line', 'Adds a bin/lot line and captures the current system quantity as the baseline for physical counting.')
  @ApiInventoryUuidParam('cycleCountId', 'Cycle-count UUID receiving the line.')
  @ApiInventoryBody(CycleCountItemCreateDto, 'Bin, lot, cycle-count, and optional variance reason.')
  @ApiInventoryResponse('Cycle-count line created.', { id: '550e8400-e29b-41d4-a716-446655440007', systemQty: '100.000' }, HttpStatus.CREATED)
  @ApiInventoryActorHeader()
  // * Function [addCycleCountItem]: Adds a bin/lot line to a cycle count.
  addCycleCountItem(
    @Param('cycleCountId', new ParseUUIDPipe()) cycleCountId: string,
    @Body() body: CycleCountItemCreateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('add-cycle-count-item', { ...body, cycleCountId }, actor(user));
  }

  @Patch('cycle-counts/:cycleCountId/items/:itemId')
  @ApiInventoryOperation('Record a cycle-count result', 'Records physical quantity for a count line and calculates the variance that will be posted when the session is completed.')
  @ApiInventoryUuidParam('cycleCountId', 'Cycle-count UUID containing the line.')
  @ApiInventoryUuidParam('itemId', 'Cycle-count item UUID to update.')
  @ApiInventoryBody(CycleCountItemUpdateDto, 'Counted quantity and optional variance reason.')
  @ApiInventoryResponse('Cycle-count result recorded.', { id: '550e8400-e29b-41d4-a716-446655440007', countedQty: '98.000', varianceQty: '-2.000' })
  @ApiInventoryActorHeader()
  // * Function [countCycleCountItem]: Records physical count quantity and variance.
  countCycleCountItem(
    @Param('cycleCountId', new ParseUUIDPipe()) cycleCountId: string,
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @Body() body: CycleCountItemUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('count-cycle-count-item', { ...body, cycleCountId, itemId }, actor(user));
  }

  @Get('products/:productId/inventory')
  @ApiInventoryOperation('List product locations', 'Returns all warehouse/bin/lot balances for one product so availability and fulfilment routing can choose a stock location.')
  @ApiInventoryUuidParam('productId', 'Catalog product UUID to inspect.')
  @ApiInventoryQueryParam('warehouseId', 'Optional warehouse UUID used to limit product locations.', { format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiInventoryResponse('Product locations returned.', [{ warehouseId: '550e8400-e29b-41d4-a716-446655440000', binCode: 'A-01', availableQty: '98.000' }])
  // * Function [productInventory]: Lists product stock locations with available quantities.
  productInventory(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.handler.execute('product-inventory', { productId, warehouseId });
  }

  @Get('products/:productId/warehouses')
  @ApiInventoryOperation('List product warehouse availability', 'Aggregates on-hand, reserved, and available quantity by warehouse for one product.')
  @ApiInventoryUuidParam('productId', 'Catalog product UUID to inspect.')
  @ApiInventoryResponse('Product warehouse availability returned.', [{ warehouseId: '550e8400-e29b-41d4-a716-446655440000', warehouseName: 'Kolkata Central Warehouse', availableQty: '240.000' }])
  // * Function [productWarehouses]: Aggregates product availability by warehouse.
  productWarehouses(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return this.handler.execute('product-warehouses', { productId });
  }

  @Get('warehouses/:warehouseId/inventory')
  @ApiInventoryOperation('List warehouse inventory', 'Returns paginated balances for all products and lots in one warehouse for picking, replenishment, and warehouse dashboards.')
  @ApiInventoryUuidParam('warehouseId', 'Warehouse UUID to inspect.')
  @ApiInventoryQuery(InventoryListQueryDto, 'Optional product, quality, availability, expiry, search, sorting, and pagination filters.')
  @ApiInventoryPaginatedResponse('Warehouse inventory returned.', { items: [{ warehouseId: '550e8400-e29b-41d4-a716-446655440000', productName: 'Paracetamol 500mg', availableQty: '98.000' }] })
  // * Function [warehouseInventory]: Lists paginated inventory balances for one warehouse.
  warehouseInventory(
    @Param('warehouseId', new ParseUUIDPipe()) warehouseId: string,
    @Query() query: InventoryListQueryDto,
  ) {
    return this.handler.execute('warehouse-inventory', { ...query, warehouseId });
  }

  @Get('warehouses/:warehouseId/products')
  @ApiInventoryOperation('List products stocked in a warehouse', 'Returns product-level aggregates for a warehouse so operators can view assortment and replenishment needs without inspecting every bin.')
  @ApiInventoryUuidParam('warehouseId', 'Warehouse UUID to inspect.')
  @ApiInventoryQuery(InventoryListQueryDto, 'Optional search and pagination filters.')
  @ApiInventoryPaginatedResponse('Warehouse products returned.', { items: [{ productId: '550e8400-e29b-41d4-a716-446655440008', productName: 'Paracetamol 500mg', availableQty: '98.000' }] })
  // * Function [warehouseProducts]: Lists product-level stock aggregates for one warehouse.
  warehouseProducts(
    @Param('warehouseId', new ParseUUIDPipe()) warehouseId: string,
    @Query() query: InventoryListQueryDto,
  ) {
    return this.handler.execute('warehouse-products', { ...query, warehouseId });
  }
}
