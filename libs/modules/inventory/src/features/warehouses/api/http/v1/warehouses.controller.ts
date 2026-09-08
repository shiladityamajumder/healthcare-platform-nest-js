import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WarehousesHandler } from '../../../application/warehouses.handler';
import { WarehousesRequestDto } from './dto/warehouses.request.dto';

@ApiTags('inventory')
@Controller({ path: 'inventory/warehouses', version: '1' })
export class WarehousesController {
  constructor(private readonly handler: WarehousesHandler) {}

  @Post()
  execute(@Body() request: WarehousesRequestDto) {
    return this.handler.execute(request);
  }
}
