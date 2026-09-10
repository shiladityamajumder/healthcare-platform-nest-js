// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/activate-user.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivateUserHandler } from '../../../application/activate-user.handler';
import { ActivateUserRequestDto } from './dto/activate-user.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('user-management')
@Controller({ path: 'user-management/activate-user', version: '1' })
export class ActivateUserController {
  constructor(private readonly handler: ActivateUserHandler) {}

  @Post()
  execute(@Body() request: ActivateUserRequestDto) {
    return this.handler.execute(request);
  }
}
