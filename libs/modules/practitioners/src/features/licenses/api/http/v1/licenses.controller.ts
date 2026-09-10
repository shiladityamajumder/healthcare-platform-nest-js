// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/licenses.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LicensesHandler } from '../../../application/licenses.handler';
import { LicensesRequestDto } from './dto/licenses.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('practitioners')
@Controller({ path: 'practitioners/licenses', version: '1' })
export class LicensesController {
  constructor(private readonly handler: LicensesHandler) {}

  @Post()
  execute(@Body() request: LicensesRequestDto) {
    return this.handler.execute(request);
  }
}
