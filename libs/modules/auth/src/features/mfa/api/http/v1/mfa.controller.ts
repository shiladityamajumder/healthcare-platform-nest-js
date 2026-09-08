import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MfaHandler } from '../../../application/mfa.handler';
import { MfaRequestDto } from './dto/mfa.request.dto';

@ApiTags('auth')
@Controller({ path: 'auth/mfa', version: '1' })
export class MfaController {
  constructor(private readonly handler: MfaHandler) {}

  @Post()
  execute(@Body() request: MfaRequestDto) {
    return this.handler.execute(request);
  }
}
