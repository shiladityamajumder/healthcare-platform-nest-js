// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/get-audit-entry.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAuditEntryHandler } from '../../../application/get-audit-entry.handler';
import { GetAuditEntryRequestDto } from './dto/get-audit-entry.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('audit')
@Controller({ path: 'audit/get-audit-entry', version: '1' })
export class GetAuditEntryController {
  constructor(private readonly handler: GetAuditEntryHandler) {}

  @Post()
  execute(@Body() request: GetAuditEntryRequestDto) {
    return this.handler.execute(request);
  }
}
