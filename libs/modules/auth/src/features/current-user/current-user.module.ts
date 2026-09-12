/**
 * Current-user feature dependency-injection boundary.
 * Used backward by AuthModule; connects forward to profile controller/service and auth infrastructure.
 */
import { Module } from '@nestjs/common';
import { AuthInfrastructureModule } from '../../infrastructure/auth-infrastructure.module';
import { CurrentUserController } from './current-user.controller';
import { CurrentUserService } from './current-user.service';

@Module({
  imports: [AuthInfrastructureModule],
  controllers: [CurrentUserController],
  providers: [CurrentUserService],
})
export class CurrentUserModule {}
