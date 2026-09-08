import { Module } from '@nestjs/common';
import { RolesController } from './api/http/v1/roles.controller';
import { RolesHandler } from './application/roles.handler';

@Module({
  controllers: [RolesController],
  providers: [RolesHandler],
})
export class RolesModule {}
