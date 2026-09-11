// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/refresh-token.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenHandler } from '../../../application/refresh-token.handler';
import { RefreshTokenRequestDto } from './dto/refresh-token.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('auth')
@Controller({ path: 'auth/refresh-token', version: '1' })
export class RefreshTokenController {
  constructor(private readonly handler: RefreshTokenHandler) {}

  @Post()
  execute(@Body() request: RefreshTokenRequestDto) {
    return this.handler.execute(request);
  }
}
