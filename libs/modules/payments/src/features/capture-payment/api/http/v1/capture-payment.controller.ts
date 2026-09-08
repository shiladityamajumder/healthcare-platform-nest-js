import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CapturePaymentHandler } from '../../../application/capture-payment.handler';
import { CapturePaymentRequestDto } from './dto/capture-payment.request.dto';

@ApiTags('payments')
@Controller({ path: 'payments/capture-payment', version: '1' })
export class CapturePaymentController {
  constructor(private readonly handler: CapturePaymentHandler) {}

  @Post()
  execute(@Body() request: CapturePaymentRequestDto) {
    return this.handler.execute(request);
  }
}
