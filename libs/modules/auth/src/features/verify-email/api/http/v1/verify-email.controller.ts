import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerifyEmailHandler } from '../../../application/verify-email.handler';
import { VerifyEmailRequestDto } from './dto/verify-email.request.dto';

@ApiTags('auth')
@Controller({ path: 'auth/verify-email', version: '1' })
export class VerifyEmailController {
  constructor(private readonly handler: VerifyEmailHandler) {}

  @Post()
  execute(@Body() request: VerifyEmailRequestDto) {
    return this.handler.execute(request);
  }
}
