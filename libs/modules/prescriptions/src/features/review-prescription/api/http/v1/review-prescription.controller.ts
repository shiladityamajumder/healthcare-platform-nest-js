import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewPrescriptionHandler } from '../../../application/review-prescription.handler';
import { ReviewPrescriptionRequestDto } from './dto/review-prescription.request.dto';

@ApiTags('prescriptions')
@Controller({ path: 'prescriptions/review-prescription', version: '1' })
export class ReviewPrescriptionController {
  constructor(private readonly handler: ReviewPrescriptionHandler) {}

  @Post()
  execute(@Body() request: ReviewPrescriptionRequestDto) {
    return this.handler.execute(request);
  }
}
