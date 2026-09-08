import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReserveStockHandler } from '../../../application/reserve-stock.handler';
import { ReserveStockRequestDto } from './dto/reserve-stock.request.dto';

@ApiTags('inventory')
@Controller({ path: 'inventory/reserve-stock', version: '1' })
export class ReserveStockController {
  constructor(private readonly handler: ReserveStockHandler) {}

  @Post()
  execute(@Body() request: ReserveStockRequestDto) {
    return this.handler.execute(request);
  }
}
