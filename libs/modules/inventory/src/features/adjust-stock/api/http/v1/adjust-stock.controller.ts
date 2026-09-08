import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdjustStockHandler } from '../../../application/adjust-stock.handler';
import { AdjustStockRequestDto } from './dto/adjust-stock.request.dto';

@ApiTags('inventory')
@Controller({ path: 'inventory/adjust-stock', version: '1' })
export class AdjustStockController {
  constructor(private readonly handler: AdjustStockHandler) {}

  @Post()
  execute(@Body() request: AdjustStockRequestDto) {
    return this.handler.execute(request);
  }
}
