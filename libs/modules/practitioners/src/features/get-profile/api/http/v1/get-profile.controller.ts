import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetProfileHandler } from '../../../application/get-profile.handler';
import { GetProfileRequestDto } from './dto/get-profile.request.dto';

@ApiTags('practitioners')
@Controller({ path: 'practitioners/get-profile', version: '1' })
export class GetProfileController {
  constructor(private readonly handler: GetProfileHandler) {}

  @Post()
  execute(@Body() request: GetProfileRequestDto) {
    return this.handler.execute(request);
  }
}
