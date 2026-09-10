// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/get-effective-price.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetEffectivePriceHandler } from '../../../application/get-effective-price.handler';
import { GetEffectivePriceRequestDto } from './dto/get-effective-price.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('pricing')
@Controller({ path: 'pricing/get-effective-price', version: '1' })
export class GetEffectivePriceController {
  constructor(private readonly handler: GetEffectivePriceHandler) {}

  @Post()
  execute(@Body() request: GetEffectivePriceRequestDto) {
    return this.handler.execute(request);
  }
}
