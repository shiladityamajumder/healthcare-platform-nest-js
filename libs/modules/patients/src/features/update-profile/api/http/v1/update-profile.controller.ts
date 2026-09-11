// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/update-profile.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProfileHandler } from '../../../application/update-profile.handler';
import { UpdateProfileRequestDto } from './dto/update-profile.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('patients')
@Controller({ path: 'patients/update-profile', version: '1' })
export class UpdateProfileController {
  constructor(private readonly handler: UpdateProfileHandler) {}

  @Post()
  execute(@Body() request: UpdateProfileRequestDto) {
    return this.handler.execute(request);
  }
}
