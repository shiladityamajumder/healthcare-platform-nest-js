import { Module } from '@nestjs/common';
import { SearchAuditLogController } from './api/http/v1/search-audit-log.controller';
import { SearchAuditLogHandler } from './application/search-audit-log.handler';

@Module({
  controllers: [SearchAuditLogController],
  providers: [SearchAuditLogHandler],
})
export class SearchAuditLogModule {}
