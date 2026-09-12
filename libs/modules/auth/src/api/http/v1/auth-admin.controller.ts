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
import { AuthApplicationService } from '../../../application/auth.application';
import {
  AdminLogoutDto,
  AssignUserRoleDto,
  CreatePermissionDto,
  CreateRoleDto,
  ListUsersQuery,
  ReplaceRolePermissionsDto,
  UpdatePermissionDto,
  UpdateRoleDto,
  UpdateStatusDto,
  UpdateUserRoleDto,
} from './dto/auth.dto';

@Controller({ path: 'admin/users', version: '1' })
export class AdminUsersController {
  public constructor(private readonly service: AuthApplicationService) {}
  @Get() async list(
    @Query() query: ListUsersQuery,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.listAdminUsers(
      query.limit,
      query.offset,
      query.search,
      query.status,
      await this.service.requirePrincipal(authorization),
    );
  }
  @Get(':userId') async get(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.getAdminUser(id, await this.service.requirePrincipal(authorization));
  }
  @Patch(':userId/status') async status(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateStatusDto,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updateUserStatus(
      id,
      body,
      await this.service.requirePrincipal(authorization),
    );
  }
  @Post(':userId/logout-all') async logoutAll(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: AdminLogoutDto,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.adminLogoutAll(
      id,
      body,
      await this.service.requirePrincipal(authorization),
    );
  }
  @Get(':userId/roles') async roles(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.userRoles(id, await this.service.requirePrincipal(authorization));
  }
  @Post(':userId/roles') @HttpCode(HttpStatus.CREATED) async assignRole(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: AssignUserRoleDto,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.assignUserRole(
      id,
      body,
      await this.service.requirePrincipal(authorization),
    );
  }
  @Patch(':userId/roles/:userRoleId') async updateRole(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('userRoleId', new ParseUUIDPipe({ version: '4' })) assignmentId: string,
    @Body() body: UpdateUserRoleDto,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updateUserRole(
      id,
      assignmentId,
      body,
      await this.service.requirePrincipal(authorization),
    );
  }
  @Delete(':userId/roles/:userRoleId') async removeRole(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('userRoleId', new ParseUUIDPipe({ version: '4' })) assignmentId: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.deleteUserRole(
      id,
      assignmentId,
      await this.service.requirePrincipal(authorization),
    );
  }
}

@Controller({ path: 'admin/roles', version: '1' })
export class AdminRolesController {
  public constructor(private readonly service: AuthApplicationService) {}
  @Get() async list(@Headers('authorization') authorization?: string) {
    return this.service.listRoles(await this.service.requirePrincipal(authorization));
  }
  @Post() @HttpCode(HttpStatus.CREATED) async create(
    @Body() body: CreateRoleDto,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.createRole(body, await this.service.requirePrincipal(authorization));
  }
  @Get(':roleId') async get(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.getRole(id, await this.service.requirePrincipal(authorization));
  }
  @Patch(':roleId') async update(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateRoleDto,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updateRole(id, body, await this.service.requirePrincipal(authorization));
  }
  @Delete(':roleId') async remove(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.deleteRole(id, await this.service.requirePrincipal(authorization));
  }
  @Get(':roleId/permissions') async permissions(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.rolePermissions(id, await this.service.requirePrincipal(authorization));
  }
  @Put(':roleId/permissions') async replacePermissions(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: ReplaceRolePermissionsDto,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.replaceRolePermissions(
      id,
      body,
      await this.service.requirePrincipal(authorization),
    );
  }
}

@Controller({ path: 'admin/permissions', version: '1' })
export class AdminPermissionsController {
  public constructor(private readonly service: AuthApplicationService) {}
  @Get() async list(@Headers('authorization') authorization?: string) {
    return this.service.listPermissions(await this.service.requirePrincipal(authorization));
  }
  @Post() @HttpCode(HttpStatus.CREATED) async create(
    @Body() body: CreatePermissionDto,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.createPermission(body, await this.service.requirePrincipal(authorization));
  }
  @Get(':permissionId') async get(
    @Param('permissionId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.getPermission(id, await this.service.requirePrincipal(authorization));
  }
  @Patch(':permissionId') async update(
    @Param('permissionId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdatePermissionDto,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updatePermission(
      id,
      body,
      await this.service.requirePrincipal(authorization),
    );
  }
  @Delete(':permissionId') async remove(
    @Param('permissionId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.deletePermission(id, await this.service.requirePrincipal(authorization));
  }
}
