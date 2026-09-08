import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrganizationHandler } from '../../../application/create-organization.handler';
import { CreateOrganizationRequestDto } from './dto/create-organization.request.dto';

@ApiTags('organizations')
@Controller({ path: 'organizations/create-organization', version: '1' })
export class CreateOrganizationController {
  constructor(private readonly handler: CreateOrganizationHandler) {}

  @Post()
  execute(@Body() request: CreateOrganizationRequestDto) {
    return this.handler.execute(request);
  }
}
