// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/create-user.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserHandler } from '../../../application/create-user.handler';
import { CreateUserRequestDto } from './dto/create-user.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('user-management')
@Controller({ path: 'user-management/create-user', version: '1' })
export class CreateUserController {
  constructor(private readonly handler: CreateUserHandler) {}

  @Post()
  execute(@Body() request: CreateUserRequestDto) {
    return this.handler.execute(request);
  }
}
