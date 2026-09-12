/**
 * Registration feature composition and dependency-injection boundary.
 * Used backward by AuthModule; connects forward to registration controllers/services and repositories.
 */
import { Module } from '@nestjs/common';
import { AuthInfrastructureModule } from '../../infrastructure/auth-infrastructure.module';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

@Module({
  imports: [AuthInfrastructureModule],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
