// * Linked with: @nestjs/common, @nestjs/swagger, ./addresses.handler.
// * Used by: API clients through the versioned HTTP route.
// * Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressesHandler } from './addresses.handler';
import { AddressesRequestDto } from './addresses.request.dto';

// * Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('patients')
@Controller({ path: 'patients/addresses', version: '1' })
export class AddressesController {
  constructor(private readonly handler: AddressesHandler) {}

  @Post()
  execute(@Body() request: AddressesRequestDto) {
    return this.handler.execute(request);
  }
}
