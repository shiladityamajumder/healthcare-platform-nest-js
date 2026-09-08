import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegistrationHandler } from '../../../application/registration.handler';
import { RegistrationRequestDto } from './dto/registration.request.dto';

@ApiTags('auth')
@Controller({ path: 'auth/registration', version: '1' })
export class RegistrationController {
  constructor(private readonly handler: RegistrationHandler) {}

  @Post()
  execute(@Body() request: RegistrationRequestDto) {
    return this.handler.execute(request);
  }
}
