// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/review-prescription.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewPrescriptionHandler } from '../../../application/review-prescription.handler';
import { ReviewPrescriptionRequestDto } from './dto/review-prescription.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('prescriptions')
@Controller({ path: 'prescriptions/review-prescription', version: '1' })
export class ReviewPrescriptionController {
  constructor(private readonly handler: ReviewPrescriptionHandler) {}

  @Post()
  execute(@Body() request: ReviewPrescriptionRequestDto) {
    return this.handler.execute(request);
  }
}
