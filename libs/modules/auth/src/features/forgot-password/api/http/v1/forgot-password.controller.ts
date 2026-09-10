// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/forgot-password.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordHandler } from '../../../application/forgot-password.handler';
import { ForgotPasswordRequestDto } from './dto/forgot-password.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('auth')
@Controller({ path: 'auth/forgot-password', version: '1' })
export class ForgotPasswordController {
  constructor(private readonly handler: ForgotPasswordHandler) {}

  @Post()
  execute(@Body() request: ForgotPasswordRequestDto) {
    return this.handler.execute(request);
  }
}
