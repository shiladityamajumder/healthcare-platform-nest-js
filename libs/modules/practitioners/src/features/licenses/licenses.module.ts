import { Module } from '@nestjs/common';
import { LicensesController } from './api/http/v1/licenses.controller';
import { LicensesHandler } from './application/licenses.handler';

@Module({
  controllers: [LicensesController],
  providers: [LicensesHandler],
})
export class LicensesModule {}
