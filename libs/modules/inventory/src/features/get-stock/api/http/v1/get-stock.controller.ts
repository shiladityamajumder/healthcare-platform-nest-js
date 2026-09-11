// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/get-stock.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetStockHandler } from '../../../application/get-stock.handler';
import { GetStockRequestDto } from './dto/get-stock.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('inventory')
@Controller({ path: 'inventory/get-stock', version: '1' })
export class GetStockController {
  constructor(private readonly handler: GetStockHandler) {}

  @Post()
  execute(@Body() request: GetStockRequestDto) {
    return this.handler.execute(request);
  }
}
