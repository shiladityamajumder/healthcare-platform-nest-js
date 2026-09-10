// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/get-profile.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetProfileHandler } from '../../../application/get-profile.handler';
import { GetProfileRequestDto } from './dto/get-profile.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('patients')
@Controller({ path: 'patients/get-profile', version: '1' })
export class GetProfileController {
  constructor(private readonly handler: GetProfileHandler) {}

  @Post()
  execute(@Body() request: GetProfileRequestDto) {
    return this.handler.execute(request);
  }
}
