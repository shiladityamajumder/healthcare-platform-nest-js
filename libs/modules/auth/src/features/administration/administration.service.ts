/**
 * Administrative use cases and authorization rules for users and RBAC resources.
 * Used backward by administration controllers; connects forward to identity/RBAC repositories.
 * Multi-write operations rely on the global operation-execution transaction.
 */
import { Injectable } from '@nestjs/common';
import { ConflictError, NotFoundError, ValidationError } from '@shared/errors';
import { AuthWorkflowService } from '../../application/workflow/auth-workflow.service';
import { toAuthInput } from '../../contracts/auth-context';
import { IdentityRepository } from '../registration/identity.repository';
import { SessionRepository } from '../session-management/session.repository';
import { AdministrationRepository } from './administration.repository';

type AuthInput = object;

@Injectable()
export class AdministrationService {
  public constructor(
    private readonly workflow: AuthWorkflowService,
    private readonly identity: IdentityRepository,
    private readonly sessions: SessionRepository,
    private readonly administration: AdministrationRepository,
  ) {}

  async listUsers(
    limit: number,
    offset: number,
    search: string | undefined,
    status: string | undefined,
    authorization?: string,
  ) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.users.read');
    const result = await this.identity.listUsers(limit, offset, search, status);
    const users = await Promise.all(
      result.rows.map(async (user) => {
        const auth = await this.identity.authorization(user.id);
        return { ...user, roles: auth.roles, permissions: auth.permissions };
      }),
    );
    return {
      data: { users },
      pagination: {
        totalCount: result.total,
        limit,
        offset,
        hasNext: offset + result.rows.length < result.total,
      },
    };
  }

  async getUser(id: string, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.users.read');
    const user = await this.identity.findUserById(id);
    if (!user) throw new NotFoundError('The user was not found.');
    const auth = await this.identity.authorization(id);
    return { ...user, roles: auth.roles, permissions: auth.permissions };
  }

  async updateStatus(id: string, input: AuthInput, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.users.manage');
    const values = toAuthInput(input);
    // Status changes and optional session revocation must commit or roll back together.
    if (id === principal.userId && values.status !== 'active')
      throw new ConflictError('Administrators cannot disable their own account here.');
    const updates: Record<string, unknown> = { status: values.status };
    if (values.status === 'active') {
      updates.failed_login_count = 0;
      updates.locked_until = null;
      updates.account_closed_at = null;
    } else if (values.status === 'closed') {
      updates.account_closed_at = new Date();
    } else {
      updates.account_closed_at = null;
    }
    const user = await this.identity.updateUser(id, updates);
    if (values.revokeSessions !== false && values.status !== 'active')
      await this.sessions.revokeAllSessions(id, String(values.reason));
    const auth = await this.identity.authorization(user.id);
    return { ...user, roles: auth.roles, permissions: auth.permissions };
  }

  async logoutAll(id: string, input: AuthInput, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.users.manage');
    if (!(await this.identity.findUserById(id))) throw new NotFoundError('The user was not found.');
    await this.sessions.revokeAllSessions(id, String(toAuthInput(input).reason));
    return { message: 'All user sessions have been revoked.' };
  }

  async listRoles(authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.roles.read');
    return { roles: await this.administration.listRoles() };
  }

  async createRole(input: AuthInput, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.roles.manage');
    const values = toAuthInput(input);
    if ((await this.administration.listRoles()).some((role) => role.code === values.code))
      throw new ConflictError('An active role with this code already exists.');
    return this.administration.createRole({
      code: String(values.code),
      name: String(values.name),
      description: values.description as string | null | undefined,
      actorUserId: principal.userId,
    });
  }

  async getRole(id: string, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.roles.read');
    const role = await this.administration.findRole(id);
    if (!role) throw new NotFoundError('The role was not found.');
    return role;
  }

  async updateRole(id: string, input: AuthInput, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.roles.manage');
    const current = await this.administration.findRole(id);
    if (!current) throw new NotFoundError('The role was not found.');
    const values = Object.fromEntries(
      Object.entries(toAuthInput(input)).filter(([, value]) => value !== undefined),
    );
    if (!Object.keys(values).length)
      throw new ValidationError('At least one role field must be supplied.');
    if (values.code === null || values.name === null)
      throw new ValidationError('Role code and name cannot be null.');
    if (current.isSystem && values.code !== undefined && values.code !== current.code)
      throw new ConflictError('System role codes cannot be changed.');
    if (
      values.code &&
      (await this.administration.listRoles()).some(
        (role) => role.code === values.code && role.id !== id,
      )
    )
      throw new ConflictError('An active role with this code already exists.');
    return this.administration.updateRole(id, values, principal.userId);
  }

  async deleteRole(id: string, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.roles.manage');
    await this.administration.deleteRole(id, principal.userId);
    return { message: 'The role has been deleted.' };
  }

  async listPermissions(authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.permissions.read');
    return { permissions: await this.administration.listPermissions() };
  }

  async createPermission(input: AuthInput, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.permissions.manage');
    const values = toAuthInput(input);
    if (
      (await this.administration.listPermissions()).some(
        (permission) => permission.code === values.code,
      )
    )
      throw new ConflictError('An active permission with this code already exists.');
    return this.administration.createPermission({ ...values, actorUserId: principal.userId });
  }

  async getPermission(id: string, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.permissions.read');
    const permission = await this.administration.findPermission(id);
    if (!permission) throw new NotFoundError('The permission was not found.');
    return permission;
  }

  async updatePermission(id: string, input: AuthInput, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.permissions.manage');
    const current = await this.administration.findPermission(id);
    if (!current) throw new NotFoundError('The permission was not found.');
    const values = Object.fromEntries(
      Object.entries(toAuthInput(input)).filter(([, value]) => value !== undefined),
    );
    if (!Object.keys(values).length)
      throw new ValidationError('At least one permission field must be supplied.');
    for (const field of ['code', 'resource', 'action'])
      if (values[field] === null) throw new ValidationError(`Permission ${field} cannot be null.`);
    if (
      values.code &&
      (await this.administration.listPermissions()).some(
        (permission) => permission.code === values.code && permission.id !== id,
      )
    )
      throw new ConflictError('An active permission with this code already exists.');
    return this.administration.updatePermission(id, values, principal.userId);
  }

  async deletePermission(id: string, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.permissions.manage');
    await this.administration.deletePermission(id, principal.userId);
    return { message: 'The permission has been deleted.' };
  }

  async rolePermissions(id: string, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.permissions.read');
    if (!(await this.administration.findRole(id)))
      throw new NotFoundError('The role was not found.');
    return { roleId: id, permissions: await this.administration.rolePermissions(id) };
  }

  async replaceRolePermissions(id: string, input: AuthInput, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.permissions.manage');
    // Validate every permission before replacing the role's current assignments.
    if (!(await this.administration.findRole(id)))
      throw new NotFoundError('The role was not found.');
    const permissionIds = (toAuthInput(input).permissionIds ?? []) as string[];
    if (new Set(permissionIds).size !== permissionIds.length)
      throw new ValidationError('permissionIds must not contain duplicates.');
    const available = await this.administration.listPermissions();
    const availableIds = new Set(available.map((permission) => permission.id));
    const missingIds = permissionIds.filter((permissionId) => !availableIds.has(permissionId));
    if (missingIds.length)
      throw new ValidationError('One or more permissions do not exist or are deleted.', {
        missingPermissionIds: missingIds,
      });
    return {
      roleId: id,
      permissions: await this.administration.replaceRolePermissions(
        id,
        permissionIds,
        principal.userId,
      ),
    };
  }

  async userRoles(id: string, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.user_roles.read');
    if (!(await this.identity.findUserById(id))) throw new NotFoundError('The user was not found.');
    return { assignments: await this.administration.userRoles(id) };
  }

  async assignUserRole(id: string, input: AuthInput, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.user_roles.manage');
    const values = toAuthInput(input);
    if (!(await this.identity.findUserById(id))) throw new NotFoundError('The user was not found.');
    if (!(await this.administration.findRole(String(values.roleId))))
      throw new NotFoundError('The role was not found.');
    validateScope(values);
    validateWindow(values.validFrom, values.validUntil);
    return this.administration.assignUserRole(id, values, principal.userId);
  }

  async updateUserRole(id: string, assignmentId: string, input: AuthInput, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.user_roles.manage');
    const values = toAuthInput(input);
    const current = (await this.administration.userRoles(id)).find(
      (role) => role.id === assignmentId,
    );
    if (!current) throw new NotFoundError('The user-role assignment was not found.');
    const hasScopeType = Object.prototype.hasOwnProperty.call(values, 'scopeType');
    const hasScopeId = Object.prototype.hasOwnProperty.call(values, 'scopeId');
    if (hasScopeType !== hasScopeId)
      throw new ValidationError('scopeType and scopeId must be supplied together.');
    if (hasScopeType && (values.scopeType === null) !== (values.scopeId === null))
      throw new ValidationError('scopeType and scopeId must be supplied together.');
    const updates = Object.fromEntries(
      Object.entries({
        scope_type: values.scopeType,
        scope_id: values.scopeId,
        valid_from: values.validFrom,
        valid_until: values.validUntil,
        is_active: values.isActive,
      }).filter(([, value]) => value !== undefined),
    );
    if (!Object.keys(updates).length)
      throw new ValidationError('At least one assignment field must be supplied.');
    validateWindow(
      updates.valid_from ?? current.validFrom,
      updates.valid_until ?? current.validUntil,
    );
    return this.administration.updateUserRole(id, assignmentId, updates, principal.userId);
  }

  async deleteUserRole(id: string, assignmentId: string, authorization?: string) {
    const principal = await this.workflow.requirePrincipal(authorization);
    this.workflow.requirePermission(principal, 'identity.user_roles.manage');
    await this.administration.deleteUserRole(id, assignmentId, principal.userId);
    return { message: 'The role assignment has been removed.' };
  }
}

function validateScope(input: Record<string, unknown>): void {
  if ((input.scopeType === undefined) !== (input.scopeId === undefined))
    throw new ValidationError('scopeType and scopeId must be supplied together.');
  if ((input.scopeType === null) !== (input.scopeId === null))
    throw new ValidationError('scopeType and scopeId must be supplied together.');
}

function validateWindow(validFrom: unknown, validUntil: unknown): void {
  const from = dateValue(validFrom);
  const until = dateValue(validUntil);
  if (from !== undefined && until !== undefined && until <= from)
    throw new ValidationError('validUntil must be later than validFrom.');
}

function dateValue(value: unknown): number | undefined {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}
