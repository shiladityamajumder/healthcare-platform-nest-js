import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeliveryStatusHandler } from '../../../application/delivery-status.handler';
import { DeliveryStatusRequestDto } from './dto/delivery-status.request.dto';

@ApiTags('notifications')
@Controller({ path: 'notifications/delivery-status', version: '1' })
export class DeliveryStatusController {
  constructor(private readonly handler: DeliveryStatusHandler) {}

  @Post()
  execute(@Body() request: DeliveryStatusRequestDto) {
    return this.handler.execute(request);
  }
}
