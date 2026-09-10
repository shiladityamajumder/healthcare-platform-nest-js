// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/adjust-stock.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdjustStockHandler } from '../../../application/adjust-stock.handler';
import { AdjustStockRequestDto } from './dto/adjust-stock.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('inventory')
@Controller({ path: 'inventory/adjust-stock', version: '1' })
export class AdjustStockController {
  constructor(private readonly handler: AdjustStockHandler) {}

  @Post()
  execute(@Body() request: AdjustStockRequestDto) {
    return this.handler.execute(request);
  }
}
