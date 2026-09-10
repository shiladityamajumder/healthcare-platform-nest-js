// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/capture-payment.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CapturePaymentHandler } from '../../../application/capture-payment.handler';
import { CapturePaymentRequestDto } from './dto/capture-payment.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('payments')
@Controller({ path: 'payments/capture-payment', version: '1' })
export class CapturePaymentController {
  constructor(private readonly handler: CapturePaymentHandler) {}

  @Post()
  execute(@Body() request: CapturePaymentRequestDto) {
    return this.handler.execute(request);
  }
}
