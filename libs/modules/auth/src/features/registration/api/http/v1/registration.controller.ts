// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/registration.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegistrationHandler } from '../../../application/registration.handler';
import { RegistrationRequestDto } from './dto/registration.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('auth')
@Controller({ path: 'auth/registration', version: '1' })
export class RegistrationController {
  constructor(private readonly handler: RegistrationHandler) {}

  @Post()
  execute(@Body() request: RegistrationRequestDto) {
    return this.handler.execute(request);
  }
}
