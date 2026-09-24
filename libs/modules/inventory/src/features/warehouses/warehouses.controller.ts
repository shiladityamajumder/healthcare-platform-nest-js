// * Linked with: @nestjs/common, @nestjs/swagger, ./warehouses.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
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
// * Inventory module: Exposes warehouse lifecycle and bin lookup endpoints.
// * File: src/features/warehouses/warehouses.controller.ts
// ? Keep transport validation and API documentation at this boundary.
// ! Delegate warehouse rules and persistence to WarehousesHandler.
import {
  ApiInventoryActorHeader,
  ApiInventoryBody,
  ApiInventoryErrors,
  ApiInventoryOperation,
  ApiInventoryPaginatedResponse,
  ApiInventoryQuery,
  ApiInventoryResponse,
  ApiInventoryUuidParam,
} from '../../contracts/swagger';
import { WarehousesHandler } from './warehouses.handler';
import {
  WarehouseCreateDto,
  WarehouseListQueryDto,
  WarehouseUpdateDto,
} from './warehouses.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('inventory')
@Controller({ path: 'warehouses', version: '1' })
@ApiInventoryErrors()
export class WarehousesController {
  // * Function [constructor]: Initializes the controller with the warehouse handler.
  constructor(private readonly handler: WarehousesHandler) {}

  @Get()
  @ApiInventoryOperation('List warehouses', 'Returns paginated warehouse records for fulfilment routing, inventory administration, and capability-based stock selection.')
  @ApiInventoryQuery(WarehouseListQueryDto, 'Optional search, lifecycle, capability, sorting, soft-delete, and pagination filters.')
  @ApiInventoryPaginatedResponse('Warehouses returned.', { items: [{ id: '550e8400-e29b-41d4-a716-446655440000', code: 'WH-KOL-01', name: 'Kolkata Central Warehouse', status: 'active' }] })
  // * Function [list]: Returns paginated warehouse records.
  list(@Query() query: WarehouseListQueryDto) {
    return this.handler.execute('list-warehouses', query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiInventoryOperation('Create a warehouse', 'Creates a warehouse linked to an organization location and records its cold-chain, controlled-drug, and operating-hours capabilities.')
  @ApiInventoryBody(WarehouseCreateDto, 'Organization, location, code, name, type, capabilities, status, and operating hours.')
  @ApiInventoryResponse('Warehouse created.', { id: '550e8400-e29b-41d4-a716-446655440000', code: 'WH-KOL-01', name: 'Kolkata Central Warehouse', status: 'active', rowVersion: 1 }, HttpStatus.CREATED)
  @ApiInventoryActorHeader()
  // * Function [create]: Creates a warehouse with its location and capabilities.
  create(@Body() request: WarehouseCreateDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('create-warehouse', request, user?.trim() || undefined);
  }

  @Get(':warehouseId')
  @ApiInventoryOperation('Get a warehouse', 'Returns one warehouse and its capabilities. Use includeDeleted=true for administrative recovery screens.')
  @ApiInventoryUuidParam('warehouseId', 'Warehouse UUID to retrieve.')
  @ApiInventoryResponse('Warehouse returned.', { id: '550e8400-e29b-41d4-a716-446655440000', code: 'WH-KOL-01', name: 'Kolkata Central Warehouse', supportsColdChain: true, rowVersion: 1 })
  // * Function [get]: Retrieves one warehouse, optionally including deleted history.
  get(
    @Param('warehouseId', new ParseUUIDPipe()) warehouseId: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    return this.handler.execute('get-warehouse', {
      warehouseId,
      includeDeleted: includeDeleted === 'true',
    });
  }

  @Patch(':warehouseId')
  @ApiInventoryOperation('Update a warehouse', 'Updates mutable warehouse metadata and capabilities using rowVersion to protect concurrent operator edits.')
  @ApiInventoryUuidParam('warehouseId', 'Warehouse UUID to update.')
  @ApiInventoryBody(WarehouseUpdateDto, 'Mutable fields and the current rowVersion.')
  @ApiInventoryResponse('Warehouse updated.', { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Kolkata Fulfilment Warehouse', rowVersion: 2 })
  @ApiInventoryActorHeader()
  // * Function [update]: Applies an optimistic-locked warehouse update.
  update(
    @Param('warehouseId', new ParseUUIDPipe()) warehouseId: string,
    @Body() request: WarehouseUpdateDto,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute(
      'update-warehouse',
      { warehouseId, ...request },
      user?.trim() || undefined,
    );
  }

  @Delete(':warehouseId')
  @ApiInventoryOperation('Deactivate a warehouse', 'Soft-deactivates a warehouse so normal inventory selection excludes it while preserving its history.')
  @ApiInventoryUuidParam('warehouseId', 'Warehouse UUID to deactivate.')
  @ApiInventoryResponse('Warehouse deactivated.', { message: 'The warehouse has been deactivated.' })
  @ApiInventoryActorHeader()
  // * Function [remove]: Soft-deactivates a warehouse.
  remove(
    @Param('warehouseId', new ParseUUIDPipe()) warehouseId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('deactivate-warehouse', { warehouseId }, user?.trim() || undefined);
  }

  @Post(':warehouseId/reactivate')
  @ApiInventoryOperation('Reactivate a warehouse', 'Restores a soft-deleted warehouse so it can be used by inventory and fulfilment workflows again.')
  @ApiInventoryUuidParam('warehouseId', 'Warehouse UUID to reactivate.')
  @ApiInventoryResponse('Warehouse reactivated.', { id: '550e8400-e29b-41d4-a716-446655440000', status: 'active', rowVersion: 3 })
  @ApiInventoryActorHeader()
  // * Function [reactivate]: Restores a soft-deleted warehouse.
  reactivate(
    @Param('warehouseId', new ParseUUIDPipe()) warehouseId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('reactivate-warehouse', { warehouseId }, user?.trim() || undefined);
  }

  @Get(':warehouseId/bins')
  @ApiInventoryOperation('List warehouse bins', 'Returns active bins and their zone, aisle, and rack context for stock placement, picking, relocation, and receiving.')
  @ApiInventoryUuidParam('warehouseId', 'Warehouse UUID whose bins should be returned.')
  @ApiInventoryResponse('Warehouse bins returned.', [{ id: '550e8400-e29b-41d4-a716-446655440009', code: 'A-01', binType: 'pick', status: 'active', pickSequence: 1 }])
  // * Function [listBins]: Lists active bins and their hierarchy context.
  listBins(@Param('warehouseId', new ParseUUIDPipe()) warehouseId: string) {
    return this.handler.execute('list-warehouse-bins', { warehouseId });
  }
}
