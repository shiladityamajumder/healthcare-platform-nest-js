import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetPrescriptionHandler } from '../../../application/get-prescription.handler';
import { GetPrescriptionRequestDto } from './dto/get-prescription.request.dto';

@ApiTags('prescriptions')
@Controller({ path: 'prescriptions/get-prescription', version: '1' })
export class GetPrescriptionController {
  constructor(private readonly handler: GetPrescriptionHandler) {}

  @Post()
  execute(@Body() request: GetPrescriptionRequestDto) {
    return this.handler.execute(request);
  }
}
