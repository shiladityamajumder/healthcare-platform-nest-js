import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResetPasswordHandler } from '../../../application/reset-password.handler';
import { ResetPasswordRequestDto } from './dto/reset-password.request.dto';

@ApiTags('auth')
@Controller({ path: 'auth/reset-password', version: '1' })
export class ResetPasswordController {
  constructor(private readonly handler: ResetPasswordHandler) {}

  @Post()
  execute(@Body() request: ResetPasswordRequestDto) {
    return this.handler.execute(request);
  }
}
