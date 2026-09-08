import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateStatusHandler } from '../../../application/update-status.handler';
import { UpdateStatusRequestDto } from './dto/update-status.request.dto';

@ApiTags('orders')
@Controller({ path: 'orders/update-status', version: '1' })
export class UpdateStatusController {
  constructor(private readonly handler: UpdateStatusHandler) {}

  @Post()
  execute(@Body() request: UpdateStatusRequestDto) {
    return this.handler.execute(request);
  }
}
