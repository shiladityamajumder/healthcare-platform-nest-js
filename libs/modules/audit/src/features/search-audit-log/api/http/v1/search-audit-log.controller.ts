// Linked with: @nestjs/common, @nestjs/swagger, ../../../application/search-audit-log.handler.
// Used by: API clients through the versioned HTTP route.
// Other linkup: The request flows from the controller to the application handler and back through the response DTO.
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchAuditLogHandler } from '../../../application/search-audit-log.handler';
import { SearchAuditLogRequestDto } from './dto/search-audit-log.request.dto';

// Expose the use case through a versioned HTTP endpoint and delegate business work.
@ApiTags('audit')
@Controller({ path: 'audit/search-audit-log', version: '1' })
export class SearchAuditLogController {
  constructor(private readonly handler: SearchAuditLogHandler) {}

  @Post()
  execute(@Body() request: SearchAuditLogRequestDto) {
    return this.handler.execute(request);
  }
}
