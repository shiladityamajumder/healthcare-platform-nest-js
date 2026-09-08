import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProfileHandler } from '../../../application/update-profile.handler';
import { UpdateProfileRequestDto } from './dto/update-profile.request.dto';

@ApiTags('practitioners')
@Controller({ path: 'practitioners/update-profile', version: '1' })
export class UpdateProfileController {
  constructor(private readonly handler: UpdateProfileHandler) {}

  @Post()
  execute(@Body() request: UpdateProfileRequestDto) {
    return this.handler.execute(request);
  }
}
