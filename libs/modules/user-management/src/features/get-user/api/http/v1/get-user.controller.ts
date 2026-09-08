import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserHandler } from '../../../application/get-user.handler';
import { GetUserRequestDto } from './dto/get-user.request.dto';

@ApiTags('user-management')
@Controller({ path: 'user-management/get-user', version: '1' })
export class GetUserController {
  constructor(private readonly handler: GetUserHandler) {}

  @Post()
  execute(@Body() request: GetUserRequestDto) {
    return this.handler.execute(request);
  }
}
