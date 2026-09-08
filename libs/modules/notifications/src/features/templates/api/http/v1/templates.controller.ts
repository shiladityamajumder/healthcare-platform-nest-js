import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TemplatesHandler } from '../../../application/templates.handler';
import { TemplatesRequestDto } from './dto/templates.request.dto';

@ApiTags('notifications')
@Controller({ path: 'notifications/templates', version: '1' })
export class TemplatesController {
  constructor(private readonly handler: TemplatesHandler) {}

  @Post()
  execute(@Body() request: TemplatesRequestDto) {
    return this.handler.execute(request);
  }
}
