// * Linked with: @nestjs/common, @nestjs/swagger, ./get-profile.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetProfileHandler } from './get-profile.handler';
import { GetProfileRequestDto } from './get-profile.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('practitioners')
@Controller({ path: 'practitioners/get-profile', version: '1' })
export class GetProfileController {
  constructor(private readonly handler: GetProfileHandler) {}

  @Post()
  execute(@Body() request: GetProfileRequestDto) {
    return this.handler.execute(request);
  }
}
