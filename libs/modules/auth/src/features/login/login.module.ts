/**
 * Login feature composition and dependency-injection boundary.
 * Used backward by AuthModule; connects forward to LoginController, LoginService, and auth infrastructure.
 */
import { Module } from '@nestjs/common';
import { AuthInfrastructureModule } from '../../infrastructure/auth-infrastructure.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [AuthInfrastructureModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
