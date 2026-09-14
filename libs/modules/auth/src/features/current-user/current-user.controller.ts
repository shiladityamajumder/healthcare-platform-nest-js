// * Auth module: Exposes authenticated current-user profile and authorization endpoints.
// * File: src/features/current-user/current-user.controller.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
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
  // * Function [constructor]: Initializes the component with its required dependencies.
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
  // * Function [get]: Retrieves and returns the requested authentication data.
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
  // * Function [update]: Updates the requested authentication state after validation.
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
  // * Function [authorization]: Retrieves and returns the requested authentication data.
  authorization(@Headers('authorization') authorization?: string) {
    return this.service.authorization(authorization);
  }
}
