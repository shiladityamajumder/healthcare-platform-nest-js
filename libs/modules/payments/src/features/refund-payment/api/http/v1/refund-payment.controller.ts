import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefundPaymentHandler } from '../../../application/refund-payment.handler';
import { RefundPaymentRequestDto } from './dto/refund-payment.request.dto';

@ApiTags('payments')
@Controller({ path: 'payments/refund-payment', version: '1' })
export class RefundPaymentController {
  constructor(private readonly handler: RefundPaymentHandler) {}

  @Post()
  execute(@Body() request: RefundPaymentRequestDto) {
    return this.handler.execute(request);
  }
}
