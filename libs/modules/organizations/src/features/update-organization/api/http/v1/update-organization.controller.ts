import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOrganizationHandler } from '../../../application/update-organization.handler';
import { UpdateOrganizationRequestDto } from './dto/update-organization.request.dto';

@ApiTags('organizations')
@Controller({ path: 'organizations/update-organization', version: '1' })
export class UpdateOrganizationController {
  constructor(private readonly handler: UpdateOrganizationHandler) {}

  @Post()
  execute(@Body() request: UpdateOrganizationRequestDto) {
    return this.handler.execute(request);
  }
}
