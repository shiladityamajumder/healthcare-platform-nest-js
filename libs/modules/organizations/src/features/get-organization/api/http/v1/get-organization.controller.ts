// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/get-organization.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetOrganizationHandler } from '../../../application/get-organization.handler';
import { GetOrganizationRequestDto } from './dto/get-organization.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('organizations')
@Controller({ path: 'organizations/get-organization', version: '1' })
export class GetOrganizationController {
  constructor(private readonly handler: GetOrganizationHandler) {}

  @Post()
  execute(@Body() request: GetOrganizationRequestDto) {
    return this.handler.execute(request);
  }
}
