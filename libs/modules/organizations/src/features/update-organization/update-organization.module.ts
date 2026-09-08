import { Module } from '@nestjs/common';
import { UpdateOrganizationController } from './api/http/v1/update-organization.controller';
import { UpdateOrganizationHandler } from './application/update-organization.handler';

@Module({
  controllers: [UpdateOrganizationController],
  providers: [UpdateOrganizationHandler],
})
export class UpdateOrganizationModule {}
