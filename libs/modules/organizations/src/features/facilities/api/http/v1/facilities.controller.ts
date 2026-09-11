// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/facilities.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FacilitiesHandler } from '../../../application/facilities.handler';
import { FacilitiesRequestDto } from './dto/facilities.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('organizations')
@Controller({ path: 'organizations/facilities', version: '1' })
export class FacilitiesController {
  constructor(private readonly handler: FacilitiesHandler) {}

  @Post()
  execute(@Body() request: FacilitiesRequestDto) {
    return this.handler.execute(request);
  }
}
