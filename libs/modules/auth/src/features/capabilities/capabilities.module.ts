/**
 * Capabilities feature dependency-injection boundary.
 * Used backward by AuthModule; connects forward to discovery controller/service and token infrastructure.
 */
import { Module } from '@nestjs/common';
import { AuthInfrastructureModule } from '../../infrastructure/auth-infrastructure.module';
import { CapabilitiesController } from './capabilities.controller';
import { CapabilitiesService } from './capabilities.service';

@Module({
  imports: [AuthInfrastructureModule],
  controllers: [CapabilitiesController],
  providers: [CapabilitiesService],
})
export class CapabilitiesModule {}
