// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/mfa.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MfaHandler } from '../../../application/mfa.handler';
import { MfaRequestDto } from './dto/mfa.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('auth')
@Controller({ path: 'auth/mfa', version: '1' })
export class MfaController {
  constructor(private readonly handler: MfaHandler) {}

  @Post()
  execute(@Body() request: MfaRequestDto) {
    return this.handler.execute(request);
  }
}
