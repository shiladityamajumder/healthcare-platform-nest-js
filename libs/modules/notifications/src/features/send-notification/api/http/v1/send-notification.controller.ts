import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendNotificationHandler } from '../../../application/send-notification.handler';
import { SendNotificationRequestDto } from './dto/send-notification.request.dto';

@ApiTags('notifications')
@Controller({ path: 'notifications/send-notification', version: '1' })
export class SendNotificationController {
  constructor(private readonly handler: SendNotificationHandler) {}

  @Post()
  execute(@Body() request: SendNotificationRequestDto) {
    return this.handler.execute(request);
  }
}
