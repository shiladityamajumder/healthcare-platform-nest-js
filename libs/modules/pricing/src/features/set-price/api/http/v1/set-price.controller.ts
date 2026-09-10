// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/set-price.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SetPriceHandler } from '../../../application/set-price.handler';
import { SetPriceRequestDto } from './dto/set-price.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('pricing')
@Controller({ path: 'pricing/set-price', version: '1' })
export class SetPriceController {
  constructor(private readonly handler: SetPriceHandler) {}

  @Post()
  execute(@Body() request: SetPriceRequestDto) {
    return this.handler.execute(request);
  }
}
