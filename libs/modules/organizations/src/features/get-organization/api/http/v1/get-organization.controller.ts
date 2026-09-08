import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetOrganizationHandler } from '../../../application/get-organization.handler';
import { GetOrganizationRequestDto } from './dto/get-organization.request.dto';

@ApiTags('organizations')
@Controller({ path: 'organizations/get-organization', version: '1' })
export class GetOrganizationController {
  constructor(private readonly handler: GetOrganizationHandler) {}

  @Post()
  execute(@Body() request: GetOrganizationRequestDto) {
    return this.handler.execute(request);
  }
}
