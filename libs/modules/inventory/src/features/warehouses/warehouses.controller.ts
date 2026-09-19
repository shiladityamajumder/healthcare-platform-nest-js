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
import { WarehousesHandler } from './warehouses.handler';
import {
  WarehouseCreateDto,
  WarehouseListQueryDto,
  WarehouseUpdateDto,
} from './warehouses.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('inventory')
@Controller({ path: 'warehouses', version: '1' })
export class WarehousesController {
  constructor(private readonly handler: WarehousesHandler) {}

  @Get()
  list(@Query() query: WarehouseListQueryDto) {
    return this.handler.execute('list-warehouses', query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() request: WarehouseCreateDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('create-warehouse', request, user?.trim() || undefined);
  }

  @Get(':warehouseId')
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
  remove(
    @Param('warehouseId', new ParseUUIDPipe()) warehouseId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('deactivate-warehouse', { warehouseId }, user?.trim() || undefined);
  }

  @Post(':warehouseId/reactivate')
  reactivate(
    @Param('warehouseId', new ParseUUIDPipe()) warehouseId: string,
    @Headers('x-user-id') user?: string,
  ) {
    return this.handler.execute('reactivate-warehouse', { warehouseId }, user?.trim() || undefined);
  }

  @Get(':warehouseId/bins')
  listBins(@Param('warehouseId', new ParseUUIDPipe()) warehouseId: string) {
    return this.handler.execute('list-warehouse-bins', { warehouseId });
  }
}
