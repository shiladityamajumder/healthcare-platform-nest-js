import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginHandler } from '../../../application/login.handler';
import { LoginRequestDto } from './dto/login.request.dto';

@ApiTags('auth')
@Controller({ path: 'auth/login', version: '1' })
export class LoginController {
  constructor(private readonly handler: LoginHandler) {}

  @Post()
  execute(@Body() request: LoginRequestDto) {
    return this.handler.execute(request);
  }
}
