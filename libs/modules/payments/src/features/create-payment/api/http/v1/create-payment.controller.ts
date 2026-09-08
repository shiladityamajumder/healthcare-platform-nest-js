import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentHandler } from '../../../application/create-payment.handler';
import { CreatePaymentRequestDto } from './dto/create-payment.request.dto';

@ApiTags('payments')
@Controller({ path: 'payments/create-payment', version: '1' })
export class CreatePaymentController {
  constructor(private readonly handler: CreatePaymentHandler) {}

  @Post()
  execute(@Body() request: CreatePaymentRequestDto) {
    return this.handler.execute(request);
  }
}
