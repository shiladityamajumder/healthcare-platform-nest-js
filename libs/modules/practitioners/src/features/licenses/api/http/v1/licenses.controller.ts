import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LicensesHandler } from '../../../application/licenses.handler';
import { LicensesRequestDto } from './dto/licenses.request.dto';

@ApiTags('practitioners')
@Controller({ path: 'practitioners/licenses', version: '1' })
export class LicensesController {
  constructor(private readonly handler: LicensesHandler) {}

  @Post()
  execute(@Body() request: LicensesRequestDto) {
    return this.handler.execute(request);
  }
}
