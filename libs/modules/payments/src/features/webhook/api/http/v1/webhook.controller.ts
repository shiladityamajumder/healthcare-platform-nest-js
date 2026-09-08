import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhookHandler } from '../../../application/webhook.handler';
import { WebhookRequestDto } from './dto/webhook.request.dto';

@ApiTags('payments')
@Controller({ path: 'payments/webhook', version: '1' })
export class WebhookController {
  constructor(private readonly handler: WebhookHandler) {}

  @Post()
  execute(@Body() request: WebhookRequestDto) {
    return this.handler.execute(request);
  }
}
