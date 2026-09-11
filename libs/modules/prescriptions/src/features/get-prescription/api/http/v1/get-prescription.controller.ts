// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/get-prescription.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetPrescriptionHandler } from '../../../application/get-prescription.handler';
import { GetPrescriptionRequestDto } from './dto/get-prescription.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('prescriptions')
@Controller({ path: 'prescriptions/get-prescription', version: '1' })
export class GetPrescriptionController {
  constructor(private readonly handler: GetPrescriptionHandler) {}

  @Post()
  execute(@Body() request: GetPrescriptionRequestDto) {
    return this.handler.execute(request);
  }
}
