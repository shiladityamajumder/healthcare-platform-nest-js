// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/create-payment.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentHandler } from '../../../application/create-payment.handler';
import { CreatePaymentRequestDto } from './dto/create-payment.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('payments')
@Controller({ path: 'payments/create-payment', version: '1' })
export class CreatePaymentController {
  constructor(private readonly handler: CreatePaymentHandler) {}

  @Post()
  execute(@Body() request: CreatePaymentRequestDto) {
    return this.handler.execute(request);
  }
}
