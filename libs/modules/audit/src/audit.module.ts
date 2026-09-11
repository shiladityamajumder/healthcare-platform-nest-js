// * Linked with: @nestjs/common, ./features/search-audit-log/search-audit-log.module, ./features/get-audit-entry/get-audit-entry.module.
// * Used by: the application module or feature root during NestJS startup.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { SearchAuditLogModule } from './features/search-audit-log/search-audit-log.module';
import { GetAuditEntryModule } from './features/get-audit-entry/get-audit-entry.module';

/** Composition root for the Audit bounded context. */
// * Register the feature components and their dependencies with NestJS.
@Module({
  imports: [SearchAuditLogModule, GetAuditEntryModule],
  exports: [],
})
export class AuditModule {}
