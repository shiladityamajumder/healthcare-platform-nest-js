// * Linked with: @nestjs/common, @nestjs/swagger, ./webhook.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhookHandler } from './webhook.handler';
import { WebhookRequestDto } from './webhook.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('payments')
@Controller({ path: 'payments/webhook', version: '1' })
export class WebhookController {
  constructor(private readonly handler: WebhookHandler) {}

  @Post()
  execute(@Body() request: WebhookRequestDto) {
    return this.handler.execute(request);
  }
}
