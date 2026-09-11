// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/transfer-stock.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransferStockHandler } from '../../../application/transfer-stock.handler';
import { TransferStockRequestDto } from './dto/transfer-stock.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('inventory')
@Controller({ path: 'inventory/transfer-stock', version: '1' })
export class TransferStockController {
  constructor(private readonly handler: TransferStockHandler) {}

  @Post()
  execute(@Body() request: TransferStockRequestDto) {
    return this.handler.execute(request);
  }
}
