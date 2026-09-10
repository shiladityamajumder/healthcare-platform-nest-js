// Linked with: @nestjs/common, ./api/http/v1/search-audit-log.controller, ./application/search-audit-log.handler.
// Used by: the package code that imports this component.
// Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { SearchAuditLogController } from './api/http/v1/search-audit-log.controller';
import { SearchAuditLogHandler } from './application/search-audit-log.handler';

// Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [SearchAuditLogController],
  providers: [SearchAuditLogHandler],
})
export class SearchAuditLogModule {}
