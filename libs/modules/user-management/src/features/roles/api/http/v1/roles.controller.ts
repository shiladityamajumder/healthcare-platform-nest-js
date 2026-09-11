// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/roles.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesHandler } from '../../../application/roles.handler';
import { RolesRequestDto } from './dto/roles.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('user-management')
@Controller({ path: 'user-management/roles', version: '1' })
export class RolesController {
  constructor(private readonly handler: RolesHandler) {}

  @Post()
  execute(@Body() request: RolesRequestDto) {
    return this.handler.execute(request);
  }
}
