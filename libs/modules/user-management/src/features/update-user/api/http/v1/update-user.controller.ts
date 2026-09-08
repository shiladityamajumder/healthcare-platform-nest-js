import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserHandler } from '../../../application/update-user.handler';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';

@ApiTags('user-management')
@Controller({ path: 'user-management/update-user', version: '1' })
export class UpdateUserController {
  constructor(private readonly handler: UpdateUserHandler) {}

  @Post()
  execute(@Body() request: UpdateUserRequestDto) {
    return this.handler.execute(request);
  }
}
