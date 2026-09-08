import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordHandler } from '../../../application/forgot-password.handler';
import { ForgotPasswordRequestDto } from './dto/forgot-password.request.dto';

@ApiTags('auth')
@Controller({ path: 'auth/forgot-password', version: '1' })
export class ForgotPasswordController {
  constructor(private readonly handler: ForgotPasswordHandler) {}

  @Post()
  execute(@Body() request: ForgotPasswordRequestDto) {
    return this.handler.execute(request);
  }
}
