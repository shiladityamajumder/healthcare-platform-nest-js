// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/change-password.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordHandler } from '../../../application/change-password.handler';
import { ChangePasswordRequestDto } from './dto/change-password.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('auth')
@Controller({ path: 'auth/change-password', version: '1' })
export class ChangePasswordController {
  constructor(private readonly handler: ChangePasswordHandler) {}

  @Post()
  execute(@Body() request: ChangePasswordRequestDto) {
    return this.handler.execute(request);
  }
}
