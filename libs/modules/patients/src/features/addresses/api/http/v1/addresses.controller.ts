import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressesHandler } from '../../../application/addresses.handler';
import { AddressesRequestDto } from './dto/addresses.request.dto';

@ApiTags('patients')
@Controller({ path: 'patients/addresses', version: '1' })
export class AddressesController {
  constructor(private readonly handler: AddressesHandler) {}

  @Post()
  execute(@Body() request: AddressesRequestDto) {
    return this.handler.execute(request);
  }
}
