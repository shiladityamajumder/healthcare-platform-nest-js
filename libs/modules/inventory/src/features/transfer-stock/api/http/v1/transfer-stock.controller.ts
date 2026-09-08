import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransferStockHandler } from '../../../application/transfer-stock.handler';
import { TransferStockRequestDto } from './dto/transfer-stock.request.dto';

@ApiTags('inventory')
@Controller({ path: 'inventory/transfer-stock', version: '1' })
export class TransferStockController {
  constructor(private readonly handler: TransferStockHandler) {}

  @Post()
  execute(@Body() request: TransferStockRequestDto) {
    return this.handler.execute(request);
  }
}
