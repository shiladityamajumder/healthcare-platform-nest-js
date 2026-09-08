import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreferencesHandler } from '../../../application/preferences.handler';
import { PreferencesRequestDto } from './dto/preferences.request.dto';

@ApiTags('notifications')
@Controller({ path: 'notifications/preferences', version: '1' })
export class PreferencesController {
  constructor(private readonly handler: PreferencesHandler) {}

  @Post()
  execute(@Body() request: PreferencesRequestDto) {
    return this.handler.execute(request);
  }
}
