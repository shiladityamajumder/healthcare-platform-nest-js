/**
 * HTTP routes for the authenticated user's profile and authorization view.
 * Used backward by Nest routing; connects forward to CurrentUserService.
 */
import { Body, Controller, Get, Headers, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCurrentUserSchema } from './current-user.schema';
import { CurrentUserService } from './current-user.service';

@ApiTags('auth')
@Controller({ version: '1' })
export class CurrentUserController {
  public constructor(private readonly service: CurrentUserService) {}

  @Get('users/me')
  get(@Headers('authorization') authorization?: string) {
    return this.service.get(authorization);
  }

  @Patch('users/me')
  update(@Body() body: UpdateCurrentUserSchema, @Headers('authorization') authorization?: string) {
    return this.service.update(body, authorization);
  }

  @Get('auth/users/me/authorization')
  authorization(@Headers('authorization') authorization?: string) {
    return this.service.authorization(authorization);
  }
}
