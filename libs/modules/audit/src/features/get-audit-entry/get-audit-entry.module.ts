// * Linked with: @nestjs/common, ./get-audit-entry.controller, ./get-audit-entry.handler.
// * Used by: the package code that imports this component.
// * Other linkup: The file participates in the package export and dependency-injection flow.
import { Module } from '@nestjs/common';
import { GetAuditEntryController } from './get-audit-entry.controller';
import { GetAuditEntryHandler } from './get-audit-entry.handler';

// * Define the shared types or behavior used by the surrounding package.
@Module({
  controllers: [GetAuditEntryController],
  providers: [GetAuditEntryHandler],
})
export class GetAuditEntryModule {}
