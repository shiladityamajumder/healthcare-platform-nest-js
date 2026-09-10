// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/send-notification.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendNotificationHandler } from '../../../application/send-notification.handler';
import { SendNotificationRequestDto } from './dto/send-notification.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('notifications')
@Controller({ path: 'notifications/send-notification', version: '1' })
export class SendNotificationController {
  constructor(private readonly handler: SendNotificationHandler) {}

  @Post()
  execute(@Body() request: SendNotificationRequestDto) {
    return this.handler.execute(request);
  }
}
