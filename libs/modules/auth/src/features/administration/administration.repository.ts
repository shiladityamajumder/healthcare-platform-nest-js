// * Auth module: Persists administrative roles, permissions, and user-role assignments.
// * File: src/features/administration/administration.repository.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * PostgreSQL adapter for administrative identity and RBAC data.
 * Used backward by AdministrationService and the composition facade; connects forward to PostgresDatabase.
 * All writes participate in the caller's global auth transaction through AsyncLocalStorage.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PostgresDatabase } from '@platform/database';
import { DatabaseError, NotFoundError } from '@shared/errors';

type Row = Record<string, any>;

@Injectable()
export class AdministrationRepository {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(private readonly database: PostgresDatabase) {}

  // * Function [listRoles]: Handles the listRoles operation for this authentication component.
  public async listRoles(): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(
      `SELECT id, code, name, description, is_system, created_at, updated_at FROM identity.roles WHERE is_deleted = false ORDER BY code`,
    );
    return result.rows.map(mapRole);
  }

  // * Function [findRole]: Handles the findRole operation for this authentication component.
  public async findRole(id: string): Promise<Record<string, unknown> | null> {
    const result = await this.database.query<Row>(
      `SELECT id, code, name, description, is_system, created_at, updated_at FROM identity.roles WHERE id = $1 AND is_deleted = false`,
      [id],
    );
    return result.rows[0] ? mapRole(result.rows[0]) : null;
  }

  // * Function [createRole]: Creates or issues the requested authentication resource.
  public async createRole(input: {
    code: string;
    name: string;
    description?: string | null;
    actorUserId: string;
  }): Promise<Record<string, unknown>> {
    const result = await this.database.query<Row>(
      `INSERT INTO identity.roles (code,name,description,created_by,updated_by) VALUES ($1,$2,$3,$4,$4) RETURNING id,code,name,description,is_system,created_at,updated_at`,
      [input.code, input.name, input.description ?? null, input.actorUserId],
    );
    return mapRole(result.rows[0]);
  }

  // * Function [updateRole]: Handles the updateRole operation for this authentication component.
  public async updateRole(
    id: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    return this.updateMaster('roles', id, values, actorUserId, true);
  }

  // * Function [deleteRole]: Invalidates or removes the requested authentication state.
  public async deleteRole(id: string, actorUserId: string): Promise<void> {
    const result = await this.database.query(
      `UPDATE identity.roles SET is_deleted = true, deleted_at = now(), deleted_by = $2, updated_at = now(), row_version = row_version + 1 WHERE id = $1 AND is_system = false AND is_deleted = false`,
      [id, actorUserId],
    );
    if (!result.rowCount) throw new NotFoundError('The role was not found or is protected.');
  }

  // * Function [listPermissions]: Handles the listPermissions operation for this authentication component.
  public async listPermissions(): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(
      `SELECT id,code,resource,action,description,created_at,updated_at FROM identity.permissions WHERE is_deleted = false ORDER BY code`,
    );
    return result.rows.map(mapPermission);
  }

  // * Function [findPermission]: Handles the findPermission operation for this authentication component.
  public async findPermission(id: string): Promise<Record<string, unknown> | null> {
    const result = await this.database.query<Row>(
      `SELECT id,code,resource,action,description,created_at,updated_at FROM identity.permissions WHERE id = $1 AND is_deleted = false`,
      [id],
    );
    return result.rows[0] ? mapPermission(result.rows[0]) : null;
  }

  // * Function [createPermission]: Creates or issues the requested authentication resource.
  public async createPermission(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const result = await this.database.query<Row>(
      `INSERT INTO identity.permissions (code,resource,action,description,created_by,updated_by) VALUES ($1,$2,$3,$4,$5,$5) RETURNING id,code,resource,action,description,created_at,updated_at`,
      [input.code, input.resource, input.action, input.description ?? null, input.actorUserId],
    );
    return mapPermission(result.rows[0]);
  }

  // * Function [updatePermission]: Handles the updatePermission operation for this authentication component.
  public async updatePermission(
    id: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    return this.updateMaster('permissions', id, values, actorUserId, false);
  }

  // * Function [deletePermission]: Invalidates or removes the requested authentication state.
  public async deletePermission(id: string, actorUserId: string): Promise<void> {
    const result = await this.database.query(
      `UPDATE identity.permissions SET is_deleted = true, deleted_at = now(), deleted_by = $2, updated_at = now(), row_version = row_version + 1 WHERE id = $1 AND is_deleted = false`,
      [id, actorUserId],
    );
    if (!result.rowCount) throw new NotFoundError('The permission was not found.');
  }

  // * Function [rolePermissions]: Handles the rolePermissions operation for this authentication component.
  public async rolePermissions(roleId: string): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(
      `SELECT p.id,p.code,p.resource,p.action,p.description,p.created_at,p.updated_at FROM identity.role_permissions rp JOIN identity.permissions p ON p.id = rp.permission_id AND p.is_deleted = false WHERE rp.role_id = $1 ORDER BY p.code`,
      [roleId],
    );
    return result.rows.map(mapPermission);
  }

  // * Function [replaceRolePermissions]: Handles the replaceRolePermissions operation for this authentication component.
  public async replaceRolePermissions(
    roleId: string,
    permissionIds: string[],
    actorUserId: string,
  ): Promise<Array<Record<string, unknown>>> {
    // Delete and reinsert are intentionally one unit; the surrounding transaction prevents partial RBAC state.
    await this.database.query(`DELETE FROM identity.role_permissions WHERE role_id = $1`, [roleId]);
    if (permissionIds.length)
      await this.database.query(
        `INSERT INTO identity.role_permissions (role_id, permission_id, created_by, updated_by) SELECT $1, p.id, $3, $3 FROM identity.permissions p WHERE p.id = ANY($2::uuid[]) AND p.is_deleted = false`,
        [roleId, permissionIds, actorUserId],
      );
    return this.rolePermissions(roleId);
  }

  // * Function [userRoles]: Handles the userRoles operation for this authentication component.
  public async userRoles(userId: string): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(
      `SELECT ur.id,ur.user_id,ur.role_id,r.code AS role_code,r.name AS role_name,ur.scope_type,ur.scope_id,ur.valid_from,ur.valid_until,ur.is_active,ur.created_at,ur.updated_at FROM identity.user_roles ur JOIN identity.roles r ON r.id = ur.role_id WHERE ur.user_id = $1 ORDER BY r.code`,
      [userId],
    );
    return result.rows.map(mapUserRole);
  }

  // * Function [assignUserRole]: Creates or issues the requested authentication resource.
  public async assignUserRole(
    userId: string,
    input: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    const result = await this.database.query<Row>(
      `INSERT INTO identity.user_roles (user_id,role_id,scope_type,scope_id,valid_from,valid_until,is_active,created_by,updated_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8) RETURNING id`,
      [
        userId,
        input.roleId,
        input.scopeType ?? null,
        input.scopeId ?? null,
        input.validFrom ?? null,
        input.validUntil ?? null,
        input.isActive ?? true,
        actorUserId,
      ],
    );
    const rows = await this.userRoles(userId);
    const found = rows.find((row) => row.id === result.rows[0].id);
    if (!found) throw new DatabaseError('The role assignment could not be loaded.');
    return found;
  }

  // * Function [updateUserRole]: Handles the updateUserRole operation for this authentication component.
  public async updateUserRole(
    userId: string,
    assignmentId: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    const fields = ['scope_type', 'scope_id', 'valid_from', 'valid_until', 'is_active'];
    const entries = Object.entries(values).filter(([key]) => fields.includes(key));
    if (entries.length)
      await this.database.query(
        `UPDATE identity.user_roles SET ${entries.map(([key], i) => `${key}=$${i + 1}`).join(',')},updated_by=$${entries.length + 1},updated_at=now(),row_version=row_version+1 WHERE id=$${entries.length + 2} AND user_id=$${entries.length + 3}`,
        [...entries.map(([, value]) => value), actorUserId, assignmentId, userId],
      );
    const rows = await this.userRoles(userId);
    const found = rows.find((row) => row.id === assignmentId);
    if (!found) throw new NotFoundError('The role assignment was not found.');
    return found;
  }

  // * Function [deleteUserRole]: Invalidates or removes the requested authentication state.
  public async deleteUserRole(
    userId: string,
    assignmentId: string,
    actorUserId: string,
  ): Promise<void> {
    const result = await this.database.query(
      `DELETE FROM identity.user_roles WHERE id=$1 AND user_id=$2`,
      [assignmentId, userId],
    );
    if (!result.rowCount) throw new NotFoundError('The role assignment was not found.');
    void actorUserId;
  }

  // * Function [updateMaster]: Handles the updateMaster operation for this authentication component.
  private async updateMaster(
    table: 'roles' | 'permissions',
    id: string,
    values: Record<string, unknown>,
    actorUserId: string,
    role: boolean,
  ): Promise<Record<string, unknown>> {
    // Only known columns are allowed into the dynamic UPDATE statement.
    const allowed = role
      ? ['code', 'name', 'description']
      : ['code', 'resource', 'action', 'description'];
    const entries = Object.entries(values).filter(([key]) => allowed.includes(key));
    if (!entries.length) throw new DatabaseError('No update fields were supplied.');
    const result = await this.database.query<Row>(
      `UPDATE identity.${table} SET ${entries.map(([key], i) => `${key}=$${i + 1}`).join(',')},updated_by=$${entries.length + 1},updated_at=now(),row_version=row_version+1 WHERE id=$${entries.length + 2} AND is_deleted=false RETURNING *`,
      [...entries.map(([, value]) => value), actorUserId, id],
    );
    if (!result.rows[0])
      throw new NotFoundError(`The ${role ? 'role' : 'permission'} was not found.`);
    return role ? mapRole(result.rows[0]) : mapPermission(result.rows[0]);
  }
}

// * Function [mapRole]: Transforms the supplied value into the format required by this authentication flow.
function mapRole(row: Row): Record<string, unknown> {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    isSystem: row.is_system,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// * Function [mapPermission]: Transforms the supplied value into the format required by this authentication flow.
function mapPermission(row: Row): Record<string, unknown> {
  return {
    id: row.id,
    code: row.code,
    resource: row.resource,
    action: row.action,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// * Function [mapUserRole]: Transforms the supplied value into the format required by this authentication flow.
function mapUserRole(row: Row): Record<string, unknown> {
  return {
    id: row.id,
    userId: row.user_id,
    roleId: row.role_id,
    roleCode: row.role_code,
    roleName: row.role_name,
    scopeType: row.scope_type,
    scopeId: row.scope_id,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
