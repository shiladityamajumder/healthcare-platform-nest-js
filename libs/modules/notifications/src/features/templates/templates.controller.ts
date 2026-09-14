// * Linked with: @nestjs/common, @nestjs/swagger, ./templates.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TemplatesHandler } from './templates.handler';
import { TemplatesRequestDto } from './templates.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('notifications')
@Controller({ path: 'notifications/templates', version: '1' })
export class TemplatesController {
  constructor(private readonly handler: TemplatesHandler) {}

  @Post()
  execute(@Body() request: TemplatesRequestDto) {
    return this.handler.execute(request);
  }
}
