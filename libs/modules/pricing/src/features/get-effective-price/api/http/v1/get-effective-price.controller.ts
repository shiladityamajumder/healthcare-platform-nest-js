import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetEffectivePriceHandler } from '../../../application/get-effective-price.handler';
import { GetEffectivePriceRequestDto } from './dto/get-effective-price.request.dto';

@ApiTags('pricing')
@Controller({ path: 'pricing/get-effective-price', version: '1' })
export class GetEffectivePriceController {
  constructor(private readonly handler: GetEffectivePriceHandler) {}

  @Post()
  execute(@Body() request: GetEffectivePriceRequestDto) {
    return this.handler.execute(request);
  }
}
