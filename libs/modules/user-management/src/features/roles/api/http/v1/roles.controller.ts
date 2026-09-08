import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesHandler } from '../../../application/roles.handler';
import { RolesRequestDto } from './dto/roles.request.dto';

@ApiTags('user-management')
@Controller({ path: 'user-management/roles', version: '1' })
export class RolesController {
  constructor(private readonly handler: RolesHandler) {}

  @Post()
  execute(@Body() request: RolesRequestDto) {
    return this.handler.execute(request);
  }
}
