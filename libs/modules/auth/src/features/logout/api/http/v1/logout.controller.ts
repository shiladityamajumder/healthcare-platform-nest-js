// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/logout.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogoutHandler } from '../../../application/logout.handler';
import { LogoutRequestDto } from './dto/logout.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('auth')
@Controller({ path: 'auth/logout', version: '1' })
export class LogoutController {
  constructor(private readonly handler: LogoutHandler) {}

  @Post()
  execute(@Body() request: LogoutRequestDto) {
    return this.handler.execute(request);
  }
}
