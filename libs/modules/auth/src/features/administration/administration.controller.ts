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
import {
  ApiAuthBody,
  ApiAuthOperation,
  ApiAuthQuery,
  ApiAuthResponse,
  ApiAuthUuidParam,
  ApiProtected,
  ApiProtectedErrors,
  ApiValidationError,
} from '../../contracts/swagger';

@ApiTags('auth')
@Controller({ path: 'admin/users', version: '1' })
@ApiProtected()
@ApiProtectedErrors()
export class AdminUsersController {
  public constructor(private readonly service: AdministrationService) {}
  @Get()
  @ApiAuthOperation(
    'List users',
    'Returns a paginated list of users. Requires the admin user-read permission.',
  )
  @ApiAuthQuery(ListUsersQuerySchema, 'Pagination and optional status/search filters.')
  @ApiAuthResponse('Users returned.', {
    users: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user@example.com',
        status: 'active',
        roles: ['clinic_admin'],
        permissions: ['user.read'],
      },
    ],
    pagination: { totalCount: 1, limit: 20, offset: 0, hasNext: false },
  })
  @ApiValidationError()
  async list(
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
  @Get(':userId')
  @ApiAuthOperation(
    'Get a user',
    'Returns one user and the roles/permissions resolved for that user.',
  )
  @ApiAuthUuidParam('userId', 'UUID of the target user.')
  @ApiAuthResponse('User returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'user@example.com',
    status: 'active',
    roles: ['clinic_admin'],
    permissions: ['user.read'],
  })
  async get(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.getUser(id, authorization);
  }
  @Patch(':userId/status')
  @ApiAuthOperation(
    'Change user status',
    'Changes a user lifecycle status and optionally revokes that user’s sessions.',
  )
  @ApiAuthUuidParam('userId', 'UUID of the target user.')
  @ApiAuthBody(UpdateStatusSchema, 'New status and auditable reason.')
  @ApiAuthResponse('User status changed.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    status: 'suspended',
  })
  @ApiValidationError()
  async status(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateStatusSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updateStatus(id, body, authorization);
  }
  @Post(':userId/logout-all')
  @ApiAuthOperation(
    'Log out a user everywhere',
    'Revokes every active session belonging to the target user for administrative security control.',
  )
  @ApiAuthUuidParam('userId', 'UUID of the target user.')
  @ApiAuthBody(AdminLogoutSchema, 'Auditable reason for administrative logout.')
  @ApiAuthResponse(
    'User sessions revoked.',
    { message: 'All sessions have been revoked.' },
    HttpStatus.CREATED,
  )
  @ApiValidationError()
  async logoutAll(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: AdminLogoutSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.logoutAll(id, body, authorization);
  }
  @Get(':userId/roles')
  @ApiAuthOperation('List user roles', 'Returns role assignments for the target user.')
  @ApiAuthUuidParam('userId', 'UUID of the target user.')
  @ApiAuthResponse('User roles returned.', {
    assignments: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        roleId: '550e8400-e29b-41d4-a716-446655440000',
        scopeType: 'clinic',
        isActive: true,
      },
    ],
  })
  async roles(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.userRoles(id, authorization);
  }
  @Post(':userId/roles')
  @HttpCode(HttpStatus.CREATED)
  @ApiAuthOperation(
    'Assign a role to a user',
    'Creates a role assignment for the target user, optionally scoped to a resource and time window.',
  )
  @ApiAuthUuidParam('userId', 'UUID of the target user.')
  @ApiAuthBody(AssignUserRoleSchema, 'Role UUID and optional scope/validity settings.')
  @ApiAuthResponse(
    'Role assigned.',
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      userId: '550e8400-e29b-41d4-a716-446655440000',
      roleId: '550e8400-e29b-41d4-a716-446655440000',
      isActive: true,
    },
    HttpStatus.CREATED,
  )
  @ApiValidationError()
  async assignRole(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: AssignUserRoleSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.assignUserRole(id, body, authorization);
  }
  @Patch(':userId/roles/:userRoleId')
  @ApiAuthOperation(
    'Update a user role assignment',
    'Changes the scope, validity, or active state of an existing role assignment.',
  )
  @ApiAuthUuidParam('userId', 'UUID of the target user.')
  @ApiAuthUuidParam('userRoleId', 'UUID of the role assignment.')
  @ApiAuthBody(UpdateUserRoleSchema, 'Fields to update on the assignment.')
  @ApiAuthResponse('Role assignment updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    isActive: false,
  })
  @ApiValidationError()
  async updateRole(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('userRoleId', new ParseUUIDPipe({ version: '4' })) assignmentId: string,
    @Body() body: UpdateUserRoleSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updateUserRole(id, assignmentId, body, authorization);
  }
  @Delete(':userId/roles/:userRoleId')
  @ApiAuthOperation(
    'Remove a user role assignment',
    'Deletes one role assignment from the target user.',
  )
  @ApiAuthUuidParam('userId', 'UUID of the target user.')
  @ApiAuthUuidParam('userRoleId', 'UUID of the role assignment.')
  @ApiAuthResponse('Role assignment removed.', { message: 'The role assignment has been removed.' })
  async removeRole(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('userRoleId', new ParseUUIDPipe({ version: '4' })) assignmentId: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.deleteUserRole(id, assignmentId, authorization);
  }
}

@ApiTags('auth')
@Controller({ path: 'admin/roles', version: '1' })
@ApiProtected()
@ApiProtectedErrors()
export class AdminRolesController {
  public constructor(private readonly service: AdministrationService) {}
  @Get()
  @ApiAuthOperation('List roles', 'Returns all roles available to the authorization system.')
  @ApiAuthResponse('Roles returned.', {
    roles: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        code: 'clinic_admin',
        name: 'Clinic Administrator',
        description: 'Manages clinic users.',
      },
    ],
  })
  async list(@Headers('authorization') authorization?: string) {
    return this.service.listRoles(authorization);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiAuthOperation('Create a role', 'Creates a role that can be assigned to users.')
  @ApiAuthBody(CreateRoleSchema, 'Role code, display name, and optional description.')
  @ApiAuthResponse(
    'Role created.',
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      code: 'clinic_admin',
      name: 'Clinic Administrator',
    },
    HttpStatus.CREATED,
  )
  @ApiValidationError()
  async create(@Body() body: CreateRoleSchema, @Headers('authorization') authorization?: string) {
    return this.service.createRole(body, authorization);
  }
  @Get(':roleId')
  @ApiAuthOperation('Get a role', 'Returns one role by UUID.')
  @ApiAuthUuidParam('roleId', 'UUID of the role.')
  @ApiAuthResponse('Role returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    code: 'clinic_admin',
    name: 'Clinic Administrator',
  })
  async get(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.getRole(id, authorization);
  }
  @Patch(':roleId')
  @ApiAuthOperation('Update a role', 'Updates the mutable fields of an existing role.')
  @ApiAuthUuidParam('roleId', 'UUID of the role.')
  @ApiAuthBody(UpdateRoleSchema, 'Role fields to update.')
  @ApiAuthResponse('Role updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    code: 'clinic_manager',
    name: 'Clinic Manager',
  })
  @ApiValidationError()
  async update(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateRoleSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updateRole(id, body, authorization);
  }
  @Delete(':roleId')
  @ApiAuthOperation(
    'Delete a role',
    'Deletes a role that is no longer needed by the authorization system.',
  )
  @ApiAuthUuidParam('roleId', 'UUID of the role.')
  @ApiAuthResponse('Role deleted.', { message: 'The role has been deleted.' })
  async remove(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.deleteRole(id, authorization);
  }
  @Get(':roleId/permissions')
  @ApiAuthOperation(
    'List role permissions',
    'Returns the permissions currently assigned to a role.',
  )
  @ApiAuthUuidParam('roleId', 'UUID of the role.')
  @ApiAuthResponse('Role permissions returned.', {
    roleId: '550e8400-e29b-41d4-a716-446655440000',
    permissions: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        code: 'user.read',
        resource: 'user',
        action: 'read',
      },
    ],
  })
  async permissions(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.rolePermissions(id, authorization);
  }
  @Put(':roleId/permissions')
  @ApiAuthOperation(
    'Replace role permissions',
    'Replaces the complete permission set for a role with the supplied permission UUIDs.',
  )
  @ApiAuthUuidParam('roleId', 'UUID of the role.')
  @ApiAuthBody(ReplaceRolePermissionsSchema, 'Complete replacement list of permission UUIDs.')
  @ApiAuthResponse('Role permissions replaced.', {
    roleId: '550e8400-e29b-41d4-a716-446655440000',
    permissions: [{ id: '550e8400-e29b-41d4-a716-446655440000', code: 'user.read' }],
  })
  @ApiValidationError()
  async replacePermissions(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: ReplaceRolePermissionsSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.replaceRolePermissions(id, body, authorization);
  }
}

@ApiTags('auth')
@Controller({ path: 'admin/permissions', version: '1' })
@ApiProtected()
@ApiProtectedErrors()
export class AdminPermissionsController {
  public constructor(private readonly service: AdministrationService) {}
  @Get()
  @ApiAuthOperation(
    'List permissions',
    'Returns all permissions available to the authorization system.',
  )
  @ApiAuthResponse('Permissions returned.', {
    permissions: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        code: 'user.read',
        resource: 'user',
        action: 'read',
        description: 'View user details.',
      },
    ],
  })
  async list(@Headers('authorization') authorization?: string) {
    return this.service.listPermissions(authorization);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiAuthOperation('Create a permission', 'Creates a permission that can be attached to roles.')
  @ApiAuthBody(
    CreatePermissionSchema,
    'Permission code, resource, action, and optional description.',
  )
  @ApiAuthResponse(
    'Permission created.',
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      code: 'user.read',
      resource: 'user',
      action: 'read',
    },
    HttpStatus.CREATED,
  )
  @ApiValidationError()
  async create(
    @Body() body: CreatePermissionSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.createPermission(body, authorization);
  }
  @Get(':permissionId')
  @ApiAuthOperation('Get a permission', 'Returns one permission by UUID.')
  @ApiAuthUuidParam('permissionId', 'UUID of the permission.')
  @ApiAuthResponse('Permission returned.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    code: 'user.read',
    resource: 'user',
    action: 'read',
  })
  async get(
    @Param('permissionId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.getPermission(id, authorization);
  }
  @Patch(':permissionId')
  @ApiAuthOperation('Update a permission', 'Updates the mutable fields of an existing permission.')
  @ApiAuthUuidParam('permissionId', 'UUID of the permission.')
  @ApiAuthBody(UpdatePermissionSchema, 'Permission fields to update.')
  @ApiAuthResponse('Permission updated.', {
    id: '550e8400-e29b-41d4-a716-446655440000',
    code: 'user.update',
    resource: 'user',
    action: 'update',
  })
  @ApiValidationError()
  async update(
    @Param('permissionId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdatePermissionSchema,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.updatePermission(id, body, authorization);
  }
  @Delete(':permissionId')
  @ApiAuthOperation('Delete a permission', 'Deletes a permission from the authorization system.')
  @ApiAuthUuidParam('permissionId', 'UUID of the permission.')
  @ApiAuthResponse('Permission deleted.', { message: 'The permission has been deleted.' })
  async remove(
    @Param('permissionId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.service.deletePermission(id, authorization);
  }
}
