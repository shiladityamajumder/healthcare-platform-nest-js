// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/verify-email.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerifyEmailHandler } from '../../../application/verify-email.handler';
import { VerifyEmailRequestDto } from './dto/verify-email.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('auth')
@Controller({ path: 'auth/verify-email', version: '1' })
export class VerifyEmailController {
  constructor(private readonly handler: VerifyEmailHandler) {}

  @Post()
  execute(@Body() request: VerifyEmailRequestDto) {
    return this.handler.execute(request);
  }
}
