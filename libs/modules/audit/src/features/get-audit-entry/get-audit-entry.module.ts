import { Module } from '@nestjs/common';
import { GetAuditEntryController } from './api/http/v1/get-audit-entry.controller';
import { GetAuditEntryHandler } from './application/get-audit-entry.handler';

@Module({
  controllers: [GetAuditEntryController],
  providers: [GetAuditEntryHandler],
})
export class GetAuditEntryModule {}
