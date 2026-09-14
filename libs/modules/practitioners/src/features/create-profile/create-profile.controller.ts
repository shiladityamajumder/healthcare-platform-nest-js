// * Linked with: @nestjs/common, @nestjs/swagger, ./create-profile.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProfileHandler } from './create-profile.handler';
import { CreateProfileRequestDto } from './create-profile.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('practitioners')
@Controller({ path: 'practitioners/create-profile', version: '1' })
export class CreateProfileController {
  constructor(private readonly handler: CreateProfileHandler) {}

  @Post()
  execute(@Body() request: CreateProfileRequestDto) {
    return this.handler.execute(request);
  }
}
