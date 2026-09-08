import { Module } from '@nestjs/common';
import { GetOrganizationController } from './api/http/v1/get-organization.controller';
import { GetOrganizationHandler } from './application/get-organization.handler';

@Module({
  controllers: [GetOrganizationController],
  providers: [GetOrganizationHandler],
})
export class GetOrganizationModule {}
