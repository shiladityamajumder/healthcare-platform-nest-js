import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogoutHandler } from '../../../application/logout.handler';
import { LogoutRequestDto } from './dto/logout.request.dto';

@ApiTags('auth')
@Controller({ path: 'auth/logout', version: '1' })
export class LogoutController {
  constructor(private readonly handler: LogoutHandler) {}

  @Post()
  execute(@Body() request: LogoutRequestDto) {
    return this.handler.execute(request);
  }
}
