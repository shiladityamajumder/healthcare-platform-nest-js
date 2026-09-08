import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenHandler } from '../../../application/refresh-token.handler';
import { RefreshTokenRequestDto } from './dto/refresh-token.request.dto';

@ApiTags('auth')
@Controller({ path: 'auth/refresh-token', version: '1' })
export class RefreshTokenController {
  constructor(private readonly handler: RefreshTokenHandler) {}

  @Post()
  execute(@Body() request: RefreshTokenRequestDto) {
    return this.handler.execute(request);
  }
}
