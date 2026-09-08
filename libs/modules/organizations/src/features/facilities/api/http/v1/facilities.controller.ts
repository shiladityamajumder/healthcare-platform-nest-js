import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FacilitiesHandler } from '../../../application/facilities.handler';
import { FacilitiesRequestDto } from './dto/facilities.request.dto';

@ApiTags('organizations')
@Controller({ path: 'organizations/facilities', version: '1' })
export class FacilitiesController {
  constructor(private readonly handler: FacilitiesHandler) {}

  @Post()
  execute(@Body() request: FacilitiesRequestDto) {
    return this.handler.execute(request);
  }
}
