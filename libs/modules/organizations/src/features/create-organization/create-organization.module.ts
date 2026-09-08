import { Module } from '@nestjs/common';
import { CreateOrganizationController } from './api/http/v1/create-organization.controller';
import { CreateOrganizationHandler } from './application/create-organization.handler';

@Module({
  controllers: [CreateOrganizationController],
  providers: [CreateOrganizationHandler],
})
export class CreateOrganizationModule {}
