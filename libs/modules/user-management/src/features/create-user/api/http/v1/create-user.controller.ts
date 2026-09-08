import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserHandler } from '../../../application/create-user.handler';
import { CreateUserRequestDto } from './dto/create-user.request.dto';

@ApiTags('user-management')
@Controller({ path: 'user-management/create-user', version: '1' })
export class CreateUserController {
  constructor(private readonly handler: CreateUserHandler) {}

  @Post()
  execute(@Body() request: CreateUserRequestDto) {
    return this.handler.execute(request);
  }
}
