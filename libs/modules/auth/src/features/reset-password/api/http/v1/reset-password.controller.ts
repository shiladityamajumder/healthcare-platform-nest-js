// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/reset-password.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResetPasswordHandler } from '../../../application/reset-password.handler';
import { ResetPasswordRequestDto } from './dto/reset-password.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('auth')
@Controller({ path: 'auth/reset-password', version: '1' })
export class ResetPasswordController {
  constructor(private readonly handler: ResetPasswordHandler) {}

  @Post()
  execute(@Body() request: ResetPasswordRequestDto) {
    return this.handler.execute(request);
  }
}
