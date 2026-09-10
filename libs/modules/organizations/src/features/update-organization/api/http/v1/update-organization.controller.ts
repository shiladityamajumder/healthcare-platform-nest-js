// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/update-organization.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOrganizationHandler } from '../../../application/update-organization.handler';
import { UpdateOrganizationRequestDto } from './dto/update-organization.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('organizations')
@Controller({ path: 'organizations/update-organization', version: '1' })
export class UpdateOrganizationController {
  constructor(private readonly handler: UpdateOrganizationHandler) {}

  @Post()
  execute(@Body() request: UpdateOrganizationRequestDto) {
    return this.handler.execute(request);
  }
}
