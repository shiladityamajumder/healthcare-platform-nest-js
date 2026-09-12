/**
 * Session-management feature dependency-injection boundary.
 * Used backward by AuthModule; connects forward to session controller/service/repository infrastructure.
 */
import { Module } from '@nestjs/common';
import { AuthInfrastructureModule } from '../../infrastructure/auth-infrastructure.module';
import { SessionManagementController } from './session-management.controller';
import { SessionManagementService } from './session-management.service';

@Module({
  imports: [AuthInfrastructureModule],
  controllers: [SessionManagementController],
  providers: [SessionManagementService],
})
export class SessionManagementModule {}
