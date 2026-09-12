/**
 * HTTP endpoints for refresh-token rotation, logout, and active-session management.
 * Used backward by Nest routing; connects forward to SessionManagementService.
 */
import { Controller, Delete, Get, Headers, Param, ParseUUIDPipe, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenSchema } from './session-management.schema';
import type { AuthRequestHeaders } from '../../contracts/auth-context';
import { SessionManagementService } from './session-management.service';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class SessionManagementController {
  public constructor(private readonly service: SessionManagementService) {}

  @Post('token/refresh')
  refresh(@Body() body: RefreshTokenSchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.refresh(body, headers);
  }

  @Post('logout')
  logout(@Body() body: RefreshTokenSchema) {
    return this.service.logout(body);
  }

  @Post('logout/others')
  logoutOthers(@Headers('authorization') authorization?: string) {
    return this.service.logoutOthers(authorization);
  }

  @Post('logout/all')
  logoutAll(@Headers('authorization') authorization?: string) {
    return this.service.logoutAll(authorization);
  }

  @Get('sessions')
  list(@Headers('authorization') authorization?: string) {
    return this.service.list(authorization);
  }

  @Delete('sessions/:sessionId')
  revoke(
    @Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.revoke(sessionId, authorization);
  }
}
