// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/returns.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReturnsHandler } from '../../../application/returns.handler';
import { ReturnsRequestDto } from './dto/returns.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('orders')
@Controller({ path: 'orders/returns', version: '1' })
export class ReturnsController {
  constructor(private readonly handler: ReturnsHandler) {}

  @Post()
  execute(@Body() request: ReturnsRequestDto) {
    return this.handler.execute(request);
  }
}
