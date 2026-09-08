import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListUsersHandler } from '../../../application/list-users.handler';
import { ListUsersRequestDto } from './dto/list-users.request.dto';

@ApiTags('user-management')
@Controller({ path: 'user-management/list-users', version: '1' })
export class ListUsersController {
  constructor(private readonly handler: ListUsersHandler) {}

  @Post()
  execute(@Body() request: ListUsersRequestDto) {
    return this.handler.execute(request);
  }
}
