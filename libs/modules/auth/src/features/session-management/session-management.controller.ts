// * Auth module: Exposes refresh, logout, session listing, and session revocation endpoints.
// * File: src/features/session-management/session-management.controller.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * HTTP endpoints for refresh-token rotation, logout, and active-session management.
 * Used backward by Nest routing; connects forward to SessionManagementService.
 */
import { Controller, Delete, Get, Headers, Param, ParseUUIDPipe, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenSchema } from './session-management.schema';
import type { AuthRequestHeaders } from '../../contracts/auth-context';
import { SessionManagementService } from './session-management.service';
import {
  ApiAuthBody,
  ApiAuthOperation,
  ApiAuthResponse,
  ApiAuthUuidParam,
  ApiClientContextHeaders,
  ApiProtected,
  ApiValidationError,
} from '../../contracts/swagger';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class SessionManagementController {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(private readonly service: SessionManagementService) {}

  @Post('token/refresh')
  @ApiAuthOperation(
    'Refresh access tokens',
    'Rotates a refresh token and returns a new access/refresh token pair. The previous refresh token becomes unusable.',
  )
  @ApiAuthBody(
    RefreshTokenSchema,
    'Refresh token issued by login, registration, or a previous refresh.',
  )
  @ApiAuthResponse(
    'Tokens refreshed.',
    {
      accessToken: 'eyJhbGciOiJIUzI1NiIs...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
      tokenType: 'Bearer',
      accessExpiresAt: '2026-01-01T01:00:00.000Z',
      refreshExpiresAt: '2026-02-01T00:00:00.000Z',
      user: { id: '550e8400-e29b-41d4-a716-446655440000' },
    },
    201,
  )
  @ApiValidationError()
  @ApiClientContextHeaders()
  // * Function [refresh]: Handles the refresh operation for this authentication component.
  refresh(@Body() body: RefreshTokenSchema, @Headers() headers: AuthRequestHeaders) {
    return this.service.refresh(body, headers);
  }

  @Post('logout')
  @ApiAuthOperation(
    'Log out the current refresh session',
    'Revokes the supplied refresh token. This endpoint does not require an access token.',
  )
  @ApiAuthBody(RefreshTokenSchema, 'Refresh token of the session to revoke.')
  @ApiAuthResponse('Session logged out.', { message: 'The session has been logged out.' }, 201)
  @ApiValidationError()
  // * Function [logout]: Invalidates or removes the requested authentication state.
  logout(@Body() body: RefreshTokenSchema) {
    return this.service.logout(body);
  }

  @Post('logout/others')
  @ApiProtected()
  @ApiAuthOperation(
    'Log out other sessions',
    'Requires an access token and revokes every session except the current one.',
  )
  @ApiAuthResponse(
    'Other sessions logged out.',
    { message: 'Other sessions have been logged out.' },
    201,
  )
  // * Function [logoutOthers]: Invalidates or removes the requested authentication state.
  logoutOthers(@Headers('authorization') authorization?: string) {
    return this.service.logoutOthers(authorization);
  }

  @Post('logout/all')
  @ApiProtected()
  @ApiAuthOperation(
    'Log out all sessions',
    'Requires an access token and revokes every active session for the authenticated user.',
  )
  @ApiAuthResponse(
    'All sessions logged out.',
    { message: 'All sessions have been logged out.' },
    201,
  )
  // * Function [logoutAll]: Invalidates or removes the requested authentication state.
  logoutAll(@Headers('authorization') authorization?: string) {
    return this.service.logoutAll(authorization);
  }

  @Get('sessions')
  @ApiProtected()
  @ApiAuthOperation(
    'List active sessions',
    'Returns the authenticated user’s active sessions and marks the session represented by the access token as current.',
  )
  @ApiAuthResponse('Active sessions returned.', {
    sessions: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        deviceId: 'android-pixel-8a-01',
        deviceType: 'android',
        ipAddress: '203.0.113.10',
        userAgent: 'Mobile App',
        createdAt: '2026-01-01T00:00:00.000Z',
        lastSeenAt: '2026-01-01T00:01:00.000Z',
        expiresAt: '2026-02-01T00:00:00.000Z',
        current: true,
      },
    ],
  })
  // * Function [list]: Retrieves and returns the requested authentication data.
  list(@Headers('authorization') authorization?: string) {
    return this.service.list(authorization);
  }

  @Delete('sessions/:sessionId')
  @ApiProtected()
  @ApiAuthOperation(
    'Revoke one session',
    'Requires an access token and revokes the selected session belonging to the authenticated user.',
  )
  @ApiAuthUuidParam('sessionId', 'UUID of the session to revoke.')
  @ApiAuthResponse('Session revoked.', { message: 'The session has been revoked.' })
  @ApiValidationError()
  // * Function [revoke]: Invalidates or removes the requested authentication state.
  revoke(
    @Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.revoke(sessionId, authorization);
  }
}
