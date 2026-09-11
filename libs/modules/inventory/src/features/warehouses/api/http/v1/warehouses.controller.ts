// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/warehouses.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WarehousesHandler } from '../../../application/warehouses.handler';
import { WarehousesRequestDto } from './dto/warehouses.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('inventory')
@Controller({ path: 'inventory/warehouses', version: '1' })
export class WarehousesController {
  constructor(private readonly handler: WarehousesHandler) {}

  @Post()
  execute(@Body() request: WarehousesRequestDto) {
    return this.handler.execute(request);
  }
}
