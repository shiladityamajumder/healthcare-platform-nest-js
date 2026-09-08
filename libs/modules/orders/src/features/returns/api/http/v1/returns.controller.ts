import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReturnsHandler } from '../../../application/returns.handler';
import { ReturnsRequestDto } from './dto/returns.request.dto';

@ApiTags('orders')
@Controller({ path: 'orders/returns', version: '1' })
export class ReturnsController {
  constructor(private readonly handler: ReturnsHandler) {}

  @Post()
  execute(@Body() request: ReturnsRequestDto) {
    return this.handler.execute(request);
  }
}
