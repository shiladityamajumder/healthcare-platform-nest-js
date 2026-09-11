// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/list-users.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListUsersHandler } from '../../../application/list-users.handler';
import { ListUsersRequestDto } from './dto/list-users.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('user-management')
@Controller({ path: 'user-management/list-users', version: '1' })
export class ListUsersController {
  constructor(private readonly handler: ListUsersHandler) {}

  @Post()
  execute(@Body() request: ListUsersRequestDto) {
    return this.handler.execute(request);
  }
}
