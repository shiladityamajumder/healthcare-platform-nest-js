/**
 * HTTP routes for the authenticated user's profile and authorization view.
 * Used backward by Nest routing; connects forward to CurrentUserService.
 */
import { Body, Controller, Get, Headers, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCurrentUserSchema } from './current-user.schema';
import { CurrentUserService } from './current-user.service';
import {
  ApiAuthBody,
  ApiAuthOperation,
  ApiAuthResponse,
  ApiProtected,
  ApiValidationError,
} from '../../contracts/swagger';

@ApiTags('auth')
@Controller({ version: '1' })
@ApiProtected()
export class CurrentUserController {
  public constructor(private readonly service: CurrentUserService) {}

  @Get('users/me')
  @ApiAuthOperation(
    'Get the current user',
    'Returns the profile and verification state for the user represented by the bearer access token.',
  )
  @ApiAuthResponse('Current user returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'user@example.com',
    emailVerified: true,
    phoneCountryCode: '+91',
    phoneNumberMasked: '+91******10',
    phoneVerified: true,
    status: 'active',
    preferredLocale: 'en-IN',
    timezone: 'Asia/Kolkata',
    displayName: 'Aarav Sharma',
    profile: { firstName: 'Aarav', lastName: 'Sharma', preferredName: 'Aarav', avatar: null },
  })
  get(@Headers('authorization') authorization?: string) {
    return this.service.get(authorization);
  }

  @Patch('users/me')
  @ApiAuthOperation(
    'Update the current user',
    'Updates editable profile preferences and names for the user represented by the bearer access token.',
  )
  @ApiAuthBody(UpdateCurrentUserSchema, 'One or more editable profile fields.')
  @ApiAuthResponse('Current user updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'user@example.com',
    status: 'active',
    preferredLocale: 'en-IN',
    timezone: 'Asia/Kolkata',
    displayName: 'Aarav Sharma',
  })
  @ApiValidationError()
  update(@Body() body: UpdateCurrentUserSchema, @Headers('authorization') authorization?: string) {
    return this.service.update(body, authorization);
  }

  @Get('auth/users/me/authorization')
  @ApiAuthOperation(
    'Get current-user authorization',
    'Returns the roles and permissions resolved for the bearer access token.',
  )
  @ApiAuthResponse('Authorization details returned.', {
    roles: ['clinic_admin'],
    permissions: ['user.read', 'user.update'],
  })
  authorization(@Headers('authorization') authorization?: string) {
    return this.service.authorization(authorization);
  }
}
