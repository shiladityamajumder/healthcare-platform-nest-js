// * Linked with: @nestjs/common, @nestjs/swagger, ./refund-payment.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefundPaymentHandler } from './refund-payment.handler';
import { RefundPaymentRequestDto } from './refund-payment.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('payments')
@Controller({ path: 'payments/refund-payment', version: '1' })
export class RefundPaymentController {
  constructor(private readonly handler: RefundPaymentHandler) {}

  @Post()
  execute(@Body() request: RefundPaymentRequestDto) {
    return this.handler.execute(request);
  }
}
