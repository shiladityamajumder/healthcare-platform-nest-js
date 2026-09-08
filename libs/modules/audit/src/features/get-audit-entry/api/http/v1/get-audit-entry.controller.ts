import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAuditEntryHandler } from '../../../application/get-audit-entry.handler';
import { GetAuditEntryRequestDto } from './dto/get-audit-entry.request.dto';

@ApiTags('audit')
@Controller({ path: 'audit/get-audit-entry', version: '1' })
export class GetAuditEntryController {
  constructor(private readonly handler: GetAuditEntryHandler) {}

  @Post()
  execute(@Body() request: GetAuditEntryRequestDto) {
    return this.handler.execute(request);
  }
}
