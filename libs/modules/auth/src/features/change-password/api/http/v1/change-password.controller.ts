import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordHandler } from '../../../application/change-password.handler';
import { ChangePasswordRequestDto } from './dto/change-password.request.dto';

@ApiTags('auth')
@Controller({ path: 'auth/change-password', version: '1' })
export class ChangePasswordController {
  constructor(private readonly handler: ChangePasswordHandler) {}

  @Post()
  execute(@Body() request: ChangePasswordRequestDto) {
    return this.handler.execute(request);
  }
}
