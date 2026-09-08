import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchAuditLogHandler } from '../../../application/search-audit-log.handler';
import { SearchAuditLogRequestDto } from './dto/search-audit-log.request.dto';

@ApiTags('audit')
@Controller({ path: 'audit/search-audit-log', version: '1' })
export class SearchAuditLogController {
  constructor(private readonly handler: SearchAuditLogHandler) {}

  @Post()
  execute(@Body() request: SearchAuditLogRequestDto) {
    return this.handler.execute(request);
  }
}
