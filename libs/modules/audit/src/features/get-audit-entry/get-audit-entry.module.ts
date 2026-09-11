// * Linked with: @nestjs/common, ./api/http/v1/get-audit-entry.controller, ./application/get-audit-entry.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetAuditEntryController } from './api/http/v1/get-audit-entry.controller';
import { GetAuditEntryHandler } from './application/get-audit-entry.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetAuditEntryController],
  providers: [GetAuditEntryHandler],
})
export class GetAuditEntryModule {}
