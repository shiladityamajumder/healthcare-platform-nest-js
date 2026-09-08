import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivateUserHandler } from '../../../application/activate-user.handler';
import { ActivateUserRequestDto } from './dto/activate-user.request.dto';

@ApiTags('user-management')
@Controller({ path: 'user-management/activate-user', version: '1' })
export class ActivateUserController {
  constructor(private readonly handler: ActivateUserHandler) {}

  @Post()
  execute(@Body() request: ActivateUserRequestDto) {
    return this.handler.execute(request);
  }
}
