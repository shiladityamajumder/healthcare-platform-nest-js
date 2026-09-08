import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConsentsHandler } from '../../../application/consents.handler';
import { ConsentsRequestDto } from './dto/consents.request.dto';

@ApiTags('patients')
@Controller({ path: 'patients/consents', version: '1' })
export class ConsentsController {
  constructor(private readonly handler: ConsentsHandler) {}

  @Post()
  execute(@Body() request: ConsentsRequestDto) {
    return this.handler.execute(request);
  }
}
