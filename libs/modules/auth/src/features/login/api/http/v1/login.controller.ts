// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/login.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginHandler } from '../../../application/login.handler';
import { LoginRequestDto } from './dto/login.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('auth')
@Controller({ path: 'auth/login', version: '1' })
export class LoginController {
  constructor(private readonly handler: LoginHandler) {}

  @Post()
  execute(@Body() request: LoginRequestDto) {
    return this.handler.execute(request);
  }
}
