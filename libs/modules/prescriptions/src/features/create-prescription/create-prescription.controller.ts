// * Linked with: @nestjs/common, @nestjs/swagger, ./create-prescription.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePrescriptionHandler } from './create-prescription.handler';
import { CreatePrescriptionRequestDto } from './create-prescription.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('prescriptions')
@Controller({ path: 'prescriptions/create-prescription', version: '1' })
export class CreatePrescriptionController {
  constructor(private readonly handler: CreatePrescriptionHandler) {}

  @Post()
  execute(@Body() request: CreatePrescriptionRequestDto) {
    return this.handler.execute(request);
  }
}
