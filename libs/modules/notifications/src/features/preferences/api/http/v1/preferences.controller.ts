// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/preferences.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PreferencesHandler } from '../../../application/preferences.handler';
import { PreferencesRequestDto } from './dto/preferences.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('notifications')
@Controller({ path: 'notifications/preferences', version: '1' })
export class PreferencesController {
  constructor(private readonly handler: PreferencesHandler) {}

  @Post()
  execute(@Body() request: PreferencesRequestDto) {
    return this.handler.execute(request);
  }
}
