// * Inventory module: Exposes replenishment-threshold maintenance and lookup endpoints.
// * File: src/features/warehouses/replenishment-rules.controller.ts
// ? Keep threshold validation in the DTO and application service.
// ! This controller must not calculate stock or issue direct SQL.
import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WarehousesHandler } from './warehouses.handler';
import { ReplenishmentRuleUpsertDto } from './warehouses.request.dto';
import { InventoryOperationalListQueryDto } from '../inventory-routes/inventory-routes.schema';
import {
  ApiInventoryActorHeader,
  ApiInventoryBody,
  ApiInventoryErrors,
  ApiInventoryOperation,
  ApiInventoryPaginatedResponse,
  ApiInventoryQuery,
  ApiInventoryResponse,
} from '../../contracts/swagger';

@ApiTags('inventory')
@Controller({ path: 'replenishment-rules', version: '1' })
@ApiInventoryErrors()
export class ReplenishmentRulesController {
  // * Function [constructor]: Initializes the controller with the warehouse handler.
  constructor(private readonly handler: WarehousesHandler) {}

  @Post('upsert')
  @ApiInventoryOperation(
    'Create or update a replenishment rule',
    'Defines the minimum, maximum, reorder, supplier, and active settings used to identify low-stock products and guide replenishment.',
  )
  @ApiInventoryBody(
    ReplenishmentRuleUpsertDto,
    'Warehouse, product, optional variant, quantity thresholds, supplier, and active flag.',
  )
  @ApiInventoryResponse('Replenishment rule saved.', {
    id: '550e8400-e29b-41d4-a716-446655440010',
    warehouseId: '550e8400-e29b-41d4-a716-446655440000',
    minimumQty: '20.000',
    maximumQty: '100.000',
  })
  @ApiInventoryActorHeader()
  // * Function [upsert]: Creates or updates a product replenishment rule.
  upsert(@Body() body: ReplenishmentRuleUpsertDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('upsert-replenishment-rule', body, user?.trim() || undefined);
  }

  @Get()
  @ApiInventoryOperation(
    'List replenishment rules',
    'Returns the replenishment rules configured for a warehouse so frontend operations screens can show current low-stock thresholds.',
  )
  @ApiInventoryQuery(
    InventoryOperationalListQueryDto,
    'Provide warehouseId to list one warehouse rules; page and pageSize are optional.',
  )
  @ApiInventoryPaginatedResponse('Replenishment rules returned.', {
    items: [
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        productName: 'Paracetamol 500mg',
        minimumQty: '20.000',
        reorderQty: '50.000',
      },
    ],
  })
  // * Function [list]: Returns replenishment rules for a warehouse.
  list(@Query() query: InventoryOperationalListQueryDto) {
    return this.handler.execute('list-replenishment-rules', query);
  }
}
