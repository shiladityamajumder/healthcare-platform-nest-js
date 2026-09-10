// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/get-user.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUserHandler } from '../../../application/get-user.handler';
import { GetUserRequestDto } from './dto/get-user.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('user-management')
@Controller({ path: 'user-management/get-user', version: '1' })
export class GetUserController {
  constructor(private readonly handler: GetUserHandler) {}

  @Post()
  execute(@Body() request: GetUserRequestDto) {
    return this.handler.execute(request);
  }
}
