// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/update-user.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserHandler } from '../../../application/update-user.handler';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('user-management')
@Controller({ path: 'user-management/update-user', version: '1' })
export class UpdateUserController {
  constructor(private readonly handler: UpdateUserHandler) {}

  @Post()
  execute(@Body() request: UpdateUserRequestDto) {
    return this.handler.execute(request);
  }
}
