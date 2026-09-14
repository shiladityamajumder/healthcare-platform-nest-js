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
import { loadAuthSql } from '../../infrastructure/persistence/sql-loader';

type Row = Record<string, any>;

@Injectable()
export class AdministrationRepository {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(private readonly database: PostgresDatabase) {}

  // * Function [listRoles]: Handles the listRoles operation for this authentication component.
  public async listRoles(): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(loadAuthSql('administration.list-roles'));
    return result.rows.map(mapRole);
  }

  // * Function [findRole]: Handles the findRole operation for this authentication component.
  public async findRole(id: string): Promise<Record<string, unknown> | null> {
    const result = await this.database.query<Row>(loadAuthSql('administration.find-role'), [id]);
    return result.rows[0] ? mapRole(result.rows[0]) : null;
  }

  // * Function [createRole]: Creates or issues the requested authentication resource.
  public async createRole(input: {
    code: string;
    name: string;
    description?: string | null;
    actorUserId: string;
  }): Promise<Record<string, unknown>> {
    const result = await this.database.query<Row>(loadAuthSql('administration.create-role'), [
      input.code,
      input.name,
      input.description ?? null,
      input.actorUserId,
    ]);
    return mapRole(result.rows[0]);
  }

  // * Function [updateRole]: Handles the updateRole operation for this authentication component.
  public async updateRole(
    id: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    return this.updateMaster(id, values, actorUserId, true);
  }

  // * Function [deleteRole]: Invalidates or removes the requested authentication state.
  public async deleteRole(id: string, actorUserId: string): Promise<void> {
    const result = await this.database.query(loadAuthSql('administration.delete-role'), [
      id,
      actorUserId,
    ]);
    if (!result.rowCount) throw new NotFoundError('The role was not found or is protected.');
  }

  // * Function [listPermissions]: Handles the listPermissions operation for this authentication component.
  public async listPermissions(): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(loadAuthSql('administration.list-permissions'));
    return result.rows.map(mapPermission);
  }

  // * Function [findPermission]: Handles the findPermission operation for this authentication component.
  public async findPermission(id: string): Promise<Record<string, unknown> | null> {
    const result = await this.database.query<Row>(loadAuthSql('administration.find-permission'), [
      id,
    ]);
    return result.rows[0] ? mapPermission(result.rows[0]) : null;
  }

  // * Function [createPermission]: Creates or issues the requested authentication resource.
  public async createPermission(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const result = await this.database.query<Row>(loadAuthSql('administration.create-permission'), [
      input.code,
      input.resource,
      input.action,
      input.description ?? null,
      input.actorUserId,
    ]);
    return mapPermission(result.rows[0]);
  }

  // * Function [updatePermission]: Handles the updatePermission operation for this authentication component.
  public async updatePermission(
    id: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    return this.updateMaster(id, values, actorUserId, false);
  }

  // * Function [deletePermission]: Invalidates or removes the requested authentication state.
  public async deletePermission(id: string, actorUserId: string): Promise<void> {
    const result = await this.database.query(loadAuthSql('administration.delete-permission'), [
      id,
      actorUserId,
    ]);
    if (!result.rowCount) throw new NotFoundError('The permission was not found.');
  }

  // * Function [rolePermissions]: Handles the rolePermissions operation for this authentication component.
  public async rolePermissions(roleId: string): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(loadAuthSql('administration.role-permissions'), [
      roleId,
    ]);
    return result.rows.map(mapPermission);
  }

  // * Function [replaceRolePermissions]: Handles the replaceRolePermissions operation for this authentication component.
  public async replaceRolePermissions(
    roleId: string,
    permissionIds: string[],
    actorUserId: string,
  ): Promise<Array<Record<string, unknown>>> {
    // Delete and reinsert are intentionally one unit; the surrounding transaction prevents partial RBAC state.
    const result = await this.database.query<Row>(
      loadAuthSql('administration.replace-role-permissions'),
      [roleId, permissionIds, actorUserId],
    );
    return result.rows.map(mapPermission);
  }

  // * Function [userRoles]: Handles the userRoles operation for this authentication component.
  public async userRoles(userId: string): Promise<Array<Record<string, unknown>>> {
    const result = await this.database.query<Row>(loadAuthSql('administration.user-roles'), [
      userId,
    ]);
    return result.rows.map(mapUserRole);
  }

  // * Function [assignUserRole]: Creates or issues the requested authentication resource.
  public async assignUserRole(
    userId: string,
    input: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    const result = await this.database.query<Row>(loadAuthSql('administration.assign-user-role'), [
      userId,
      input.roleId,
      input.scopeType ?? null,
      input.scopeId ?? null,
      input.validFrom ?? null,
      input.validUntil ?? null,
      input.isActive ?? true,
      actorUserId,
    ]);
    if (!result.rows[0]) throw new DatabaseError('The role assignment could not be loaded.');
    return mapUserRole(result.rows[0]);
  }

  // * Function [updateUserRole]: Handles the updateUserRole operation for this authentication component.
  public async updateUserRole(
    userId: string,
    assignmentId: string,
    values: Record<string, unknown>,
    actorUserId: string,
  ): Promise<Record<string, unknown>> {
    const result = await this.database.query<Row>(loadAuthSql('administration.update-user-role'), [
      userId,
      assignmentId,
      JSON.stringify(values),
      actorUserId,
    ]);
    if (!result.rows[0]) throw new NotFoundError('The role assignment was not found.');
    return mapUserRole(result.rows[0]);
  }

  // * Function [deleteUserRole]: Invalidates or removes the requested authentication state.
  public async deleteUserRole(
    userId: string,
    assignmentId: string,
    actorUserId: string,
  ): Promise<void> {
    const result = await this.database.query(loadAuthSql('administration.delete-user-role'), [
      assignmentId,
      userId,
    ]);
    if (!result.rowCount) throw new NotFoundError('The role assignment was not found.');
    void actorUserId;
  }

  // * Function [updateMaster]: Handles the updateMaster operation for this authentication component.
  private async updateMaster(
    id: string,
    values: Record<string, unknown>,
    actorUserId: string,
    role: boolean,
  ): Promise<Record<string, unknown>> {
    // The SQL file exposes separate, fixed-column update statements for each RBAC resource.
    if (!Object.keys(values).length) throw new DatabaseError('No update fields were supplied.');
    const result = await this.database.query<Row>(
      loadAuthSql(role ? 'administration.update-role' : 'administration.update-permission'),
      [id, JSON.stringify(values), actorUserId],
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
