import { Module } from '@nestjs/common';
import { SearchAuditLogModule } from './features/search-audit-log/search-audit-log.module';
import { GetAuditEntryModule } from './features/get-audit-entry/get-audit-entry.module';

/** Composition root for the Audit bounded context. */
@Module({
  imports: [SearchAuditLogModule, GetAuditEntryModule],
  exports: [],
})
export class AuditModule {}
