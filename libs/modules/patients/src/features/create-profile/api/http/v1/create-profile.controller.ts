import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProfileHandler } from '../../../application/create-profile.handler';
import { CreateProfileRequestDto } from './dto/create-profile.request.dto';

@ApiTags('patients')
@Controller({ path: 'patients/create-profile', version: '1' })
export class CreateProfileController {
  constructor(private readonly handler: CreateProfileHandler) {}

  @Post()
  execute(@Body() request: CreateProfileRequestDto) {
    return this.handler.execute(request);
  }
}
