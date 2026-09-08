import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePrescriptionHandler } from '../../../application/create-prescription.handler';
import { CreatePrescriptionRequestDto } from './dto/create-prescription.request.dto';

@ApiTags('prescriptions')
@Controller({ path: 'prescriptions/create-prescription', version: '1' })
export class CreatePrescriptionController {
  constructor(private readonly handler: CreatePrescriptionHandler) {}

  @Post()
  execute(@Body() request: CreatePrescriptionRequestDto) {
    return this.handler.execute(request);
  }
}
