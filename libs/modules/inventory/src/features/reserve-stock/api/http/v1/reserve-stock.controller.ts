// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/reserve-stock.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReserveStockHandler } from '../../../application/reserve-stock.handler';
import { ReserveStockRequestDto } from './dto/reserve-stock.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('inventory')
@Controller({ path: 'inventory/reserve-stock', version: '1' })
export class ReserveStockController {
  constructor(private readonly handler: ReserveStockHandler) {}

  @Post()
  execute(@Body() request: ReserveStockRequestDto) {
    return this.handler.execute(request);
  }
}
