// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/create-organization.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrganizationHandler } from '../../../application/create-organization.handler';
import { CreateOrganizationRequestDto } from './dto/create-organization.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('organizations')
@Controller({ path: 'organizations/create-organization', version: '1' })
export class CreateOrganizationController {
  constructor(private readonly handler: CreateOrganizationHandler) {}

  @Post()
  execute(@Body() request: CreateOrganizationRequestDto) {
    return this.handler.execute(request);
  }
}
