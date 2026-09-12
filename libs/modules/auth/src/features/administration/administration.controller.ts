/**
 * HTTP endpoints for user administration, roles, permissions, and assignments.
 * Used backward by Nest routing; connects forward to AdministrationService after DTO validation.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdministrationService } from './administration.service';
import {
  AdminLogoutSchema,
  AssignUserRoleSchema,
  CreatePermissionSchema,
  CreateRoleSchema,
  ListUsersQuerySchema,
  ReplaceRolePermissionsSchema,
  UpdatePermissionSchema,
  UpdateRoleSchema,
  UpdateStatusSchema,
  UpdateUserRoleSchema,
} from './administration.schema';

@ApiTags('auth')
@Controller({ path: 'admin/users', version: '1' })
export class AdminUsersController {
  public constructor(private readonly service: AdministrationService) {}
  @Get() async list(
    @Query() query: ListUsersQuerySchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.listUsers(
      query.limit,
      query.offset,
      query.search,
      query.status,
      authorization,
    );
  }
  @Get(':userId') async get(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.getUser(id, authorization);
  }
  @Patch(':userId/status') async status(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateStatusSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updateStatus(id, body, authorization);
  }
  @Post(':userId/logout-all') async logoutAll(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: AdminLogoutSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.logoutAll(id, body, authorization);
  }
  @Get(':userId/roles') async roles(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.userRoles(id, authorization);
  }
  @Post(':userId/roles') @HttpCode(HttpStatus.CREATED) async assignRole(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: AssignUserRoleSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.assignUserRole(id, body, authorization);
  }
  @Patch(':userId/roles/:userRoleId') async updateRole(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('userRoleId', new ParseUUIDPipe({ version: '4' })) assignmentId: string,
    @Body() body: UpdateUserRoleSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updateUserRole(id, assignmentId, body, authorization);
  }
  @Delete(':userId/roles/:userRoleId') async removeRole(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('userRoleId', new ParseUUIDPipe({ version: '4' })) assignmentId: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.deleteUserRole(id, assignmentId, authorization);
  }
}

@ApiTags('auth')
@Controller({ path: 'admin/roles', version: '1' })
export class AdminRolesController {
  public constructor(private readonly service: AdministrationService) {}
  @Get() async list(@Headers('authorization') authorization?: string) {
    return this.service.listRoles(authorization);
  }
  @Post() @HttpCode(HttpStatus.CREATED) async create(
    @Body() body: CreateRoleSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.createRole(body, authorization);
  }
  @Get(':roleId') async get(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.getRole(id, authorization);
  }
  @Patch(':roleId') async update(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateRoleSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updateRole(id, body, authorization);
  }
  @Delete(':roleId') async remove(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.deleteRole(id, authorization);
  }
  @Get(':roleId/permissions') async permissions(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.rolePermissions(id, authorization);
  }
  @Put(':roleId/permissions') async replacePermissions(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: ReplaceRolePermissionsSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.replaceRolePermissions(id, body, authorization);
  }
}

@ApiTags('auth')
@Controller({ path: 'admin/permissions', version: '1' })
export class AdminPermissionsController {
  public constructor(private readonly service: AdministrationService) {}
  @Get() async list(@Headers('authorization') authorization?: string) {
    return this.service.listPermissions(authorization);
  }
  @Post() @HttpCode(HttpStatus.CREATED) async create(
    @Body() body: CreatePermissionSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.createPermission(body, authorization);
  }
  @Get(':permissionId') async get(
    @Param('permissionId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.getPermission(id, authorization);
  }
  @Patch(':permissionId') async update(
    @Param('permissionId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdatePermissionSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updatePermission(id, body, authorization);
  }
  @Delete(':permissionId') async remove(
    @Param('permissionId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.deletePermission(id, authorization);
  }
}
