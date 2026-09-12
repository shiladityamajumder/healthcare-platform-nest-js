import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Patch,
} from '@nestjs/common';
import { AuthApplicationService } from '../../../application/auth.application';
import { authContext } from './auth-http.helpers';
import { ChangePasswordDto, SetPasswordDto, UpdateCurrentUserDto } from './dto/auth.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthSessionController {
  public constructor(private readonly service: AuthApplicationService) {}
  @Post('logout/others') async logoutOthers(@Headers('authorization') authorization?: string) {
    return this.service.logoutOthers(await this.service.requirePrincipal(authorization));
  }
  @Post('logout/all') async logoutAll(@Headers('authorization') authorization?: string) {
    return this.service.logoutAll(await this.service.requirePrincipal(authorization));
  }
  @Get('sessions') async sessions(@Headers('authorization') authorization?: string) {
    return this.service.listSessions(await this.service.requirePrincipal(authorization));
  }
  @Delete('sessions/:sessionId') async revoke(
    @Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.revokeSession(
      await this.service.requirePrincipal(authorization),
      sessionId,
    );
  }
  @Put('password') async changePassword(
    @Body() body: ChangePasswordDto,
    @Headers('authorization') authorization?: string,
    @Headers() headers?: Record<string, string | string[] | undefined>,
  ) {
    return this.service.changePassword(
      body,
      await this.service.requirePrincipal(authorization),
      authContext(headers ?? {}),
    );
  }
  @Post('password') async setPassword(
    @Body() body: SetPasswordDto,
    @Headers('authorization') authorization?: string,
    @Headers() headers?: Record<string, string | string[] | undefined>,
  ) {
    return this.service.setPassword(
      body,
      await this.service.requirePrincipal(authorization),
      authContext(headers ?? {}),
    );
  }
}

@Controller({ path: 'auth/users/me', version: '1' })
export class CurrentAuthorizationController {
  public constructor(private readonly service: AuthApplicationService) {}
  @Get('authorization') async authorization(@Headers('authorization') authorization?: string) {
    return this.service.getAuthorization(await this.service.requirePrincipal(authorization));
  }
}

@Controller({ path: 'users/me', version: '1' })
export class CurrentUserController {
  public constructor(private readonly service: AuthApplicationService) {}
  @Get() async get(@Headers('authorization') authorization?: string) {
    return this.service.getCurrentUser(await this.service.requirePrincipal(authorization));
  }
  @Patch() async update(
    @Body() body: UpdateCurrentUserDto,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updateCurrentUser(await this.service.requirePrincipal(authorization), body);
  }
}
