// * Linked with: @nestjs/common, @nestjs/swagger, ../../../application/consents.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConsentsHandler } from '../../../application/consents.handler';
import { ConsentsRequestDto } from './dto/consents.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('patients')
@Controller({ path: 'patients/consents', version: '1' })
export class ConsentsController {
  constructor(private readonly handler: ConsentsHandler) {}

  @Post()
  execute(@Body() request: ConsentsRequestDto) {
    return this.handler.execute(request);
  }
}
