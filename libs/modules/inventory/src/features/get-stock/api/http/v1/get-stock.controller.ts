import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetStockHandler } from '../../../application/get-stock.handler';
import { GetStockRequestDto } from './dto/get-stock.request.dto';

@ApiTags('inventory')
@Controller({ path: 'inventory/get-stock', version: '1' })
export class GetStockController {
  constructor(private readonly handler: GetStockHandler) {}

  @Post()
  execute(@Body() request: GetStockRequestDto) {
    return this.handler.execute(request);
  }
}
