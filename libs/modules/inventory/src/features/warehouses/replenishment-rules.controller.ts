import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WarehousesHandler } from './warehouses.handler';
import { ReplenishmentRuleUpsertDto } from './warehouses.request.dto';

@ApiTags('inventory')
@Controller({ path: 'replenishment-rules', version: '1' })
export class ReplenishmentRulesController {
  constructor(private readonly handler: WarehousesHandler) {}

  @Post('upsert')
  upsert(@Body() body: ReplenishmentRuleUpsertDto, @Headers('x-user-id') user?: string) {
    return this.handler.execute('upsert-replenishment-rule', body, user?.trim() || undefined);
  }
}
