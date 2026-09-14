/**
 * Seeds the managed identity RBAC master data.
 *
 * This is intentionally a standalone operational tool. It does not create users,
 * memberships, credentials, or domain records.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PlatformConfigModule } from '@platform/config';
import { DatabaseModule, PostgresDatabase, TABLES } from '@platform/database';
import type { PoolClient, QueryResultRow } from 'pg';

interface PermissionSeed {
  resource: string;
  action: string;
  description: string;
}

interface RoleSeed {
  code: string;
  name: string;
  description: string;
  permissions: readonly string[];
}

interface Manifest {
  permissions: readonly PermissionSeed[];
  roles: readonly RoleSeed[];
}

type PermissionRow = QueryResultRow & {
  id: string;
  code: string;
  resource: string;
  action: string;
  description: string | null;
};

type RoleRow = QueryResultRow & {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_system: boolean;
};

type RolePermissionRow = QueryResultRow & {
  id: string;
  role_id: string;
  permission_id: string;
};

type SeedSummary = {
  permissionsCreated: number;
  permissionsUpdated: number;
  rolesCreated: number;
  rolesUpdated: number;
  mappingsCreated: number;
  mappingsRemoved: number;
};

const manifest = JSON.parse(
  readFileSync(join(__dirname, 'identity-rbac-manifest.json'), 'utf8'),
) as Manifest;

@Module({
  imports: [PlatformConfigModule, DatabaseModule],
})
class SeedModule {}

const ROLE_CODE_PATTERN = /^[a-z][a-z0-9_.-]{1,63}$/;
const RESOURCE_PATTERN = /^[a-z][a-z0-9_.-]{1,63}$/;
const ACTION_PATTERN = /^[a-z][a-z0-9_-]{1,63}$/;

function permissionCode(seed: PermissionSeed): string {
  return `${seed.resource}.${seed.action}`;
}

function validateSeedManifest(): void {
  const permissionCodes = manifest.permissions.map(permissionCode);
  const allPermissionCodes = new Set(permissionCodes);

  if (allPermissionCodes.size !== permissionCodes.length) {
    throw new Error('Permission seed codes must be unique.');
  }

  for (const permission of manifest.permissions) {
    const code = permissionCode(permission);
    if (!RESOURCE_PATTERN.test(permission.resource)) {
      throw new Error(`Invalid permission resource: ${permission.resource}`);
    }
    if (!ACTION_PATTERN.test(permission.action)) {
      throw new Error(`Invalid permission action: ${permission.action}`);
    }
    if (code.length > 128) {
      throw new Error(`Permission code is too long: ${code}`);
    }
    if (!permission.description.trim()) {
      throw new Error(`Permission '${code}' requires a description.`);
    }
  }

  const roleCodes = manifest.roles.map((role) => role.code);
  if (new Set(roleCodes).size !== roleCodes.length) {
    throw new Error('Role seed codes must be unique.');
  }

  for (const role of manifest.roles) {
    if (!ROLE_CODE_PATTERN.test(role.code)) {
      throw new Error(`Invalid role code: ${role.code}`);
    }
    if (!role.name.trim() || !role.description.trim()) {
      throw new Error(`Role '${role.code}' requires a name and description.`);
    }
    if (role.permissions.length === 0) {
      throw new Error(`Role '${role.code}' must contain at least one permission.`);
    }

    for (const code of role.permissions) {
      if (!allPermissionCodes.has(code)) {
        throw new Error(`Role '${role.code}' references unknown permission: ${code}`);
      }

      const separator = code.lastIndexOf('.');
      const resource = code.slice(0, separator);
      const action = code.slice(separator + 1);
      const readCode = `${resource}.read`;
      if (
        action !== 'read' &&
        allPermissionCodes.has(readCode) &&
        !role.permissions.includes(readCode)
      ) {
        throw new Error(`Role '${role.code}' can '${action}' '${resource}' without read access.`);
      }
    }
  }

  const superAdmin = manifest.roles.find((role) => role.code === 'super_admin');
  if (
    !superAdmin ||
    new Set(superAdmin.permissions).size !== allPermissionCodes.size ||
    superAdmin.permissions.some((code) => !allPermissionCodes.has(code))
  ) {
    throw new Error('The super_admin role must contain every managed permission.');
  }
}

async function upsertPermissions(
  client: PoolClient,
): Promise<{ records: Map<string, PermissionRow>; created: number; updated: number }> {
  const codes = manifest.permissions.map(permissionCode);
  const result = await client.query<PermissionRow>(
    `SELECT id, code, resource, action, description
       FROM ${TABLES.identity.permissions}
      WHERE is_deleted = FALSE
        AND code = ANY($1::text[])
      FOR UPDATE`,
    [codes],
  );
  const records = new Map(result.rows.map((row) => [row.code, row]));
  let created = 0;
  let updated = 0;

  for (const seed of manifest.permissions) {
    const code = permissionCode(seed);
    const current = records.get(code);
    if (!current) {
      const inserted = await client.query<PermissionRow>(
        `INSERT INTO ${TABLES.identity.permissions}
           (code, resource, action, description, is_deleted)
         VALUES ($1, $2, $3, $4, FALSE)
         RETURNING id, code, resource, action, description`,
        [code, seed.resource, seed.action, seed.description],
      );
      records.set(code, inserted.rows[0]);
      created += 1;
      continue;
    }

    if (
      current.resource !== seed.resource ||
      current.action !== seed.action ||
      current.description !== seed.description
    ) {
      await client.query(
        `UPDATE ${TABLES.identity.permissions}
            SET resource = $2, action = $3, description = $4, updated_by = NULL
          WHERE id = $1`,
        [current.id, seed.resource, seed.action, seed.description],
      );
      current.resource = seed.resource;
      current.action = seed.action;
      current.description = seed.description;
      updated += 1;
    }
  }

  return { records, created, updated };
}

async function upsertRoles(
  client: PoolClient,
): Promise<{ records: Map<string, RoleRow>; created: number; updated: number }> {
  const codes = manifest.roles.map((role) => role.code);
  const result = await client.query<RoleRow>(
    `SELECT id, code, name, description, is_system
       FROM ${TABLES.identity.roles}
      WHERE is_deleted = FALSE
        AND code = ANY($1::text[])
      FOR UPDATE`,
    [codes],
  );
  const records = new Map(result.rows.map((row) => [row.code, row]));
  let created = 0;
  let updated = 0;

  for (const seed of manifest.roles) {
    const current = records.get(seed.code);
    if (!current) {
      const inserted = await client.query<RoleRow>(
        `INSERT INTO ${TABLES.identity.roles}
           (code, name, description, is_system, is_deleted)
         VALUES ($1, $2, $3, TRUE, FALSE)
         RETURNING id, code, name, description, is_system`,
        [seed.code, seed.name, seed.description],
      );
      records.set(seed.code, inserted.rows[0]);
      created += 1;
      continue;
    }

    if (
      current.name !== seed.name ||
      current.description !== seed.description ||
      !current.is_system
    ) {
      await client.query(
        `UPDATE ${TABLES.identity.roles}
            SET name = $2, description = $3, is_system = TRUE, updated_by = NULL
          WHERE id = $1`,
        [current.id, seed.name, seed.description],
      );
      current.name = seed.name;
      current.description = seed.description;
      current.is_system = true;
      updated += 1;
    }
  }

  return { records, created, updated };
}

async function synchronizeRolePermissions(
  client: PoolClient,
  roles: Map<string, RoleRow>,
  permissions: Map<string, PermissionRow>,
): Promise<{ created: number; removed: number }> {
  const roleIds = manifest.roles.map((role) => roles.get(role.code)?.id);
  if (roleIds.some((id) => !id)) {
    throw new Error('Seed manifest contains a role that was not persisted.');
  }
  const persistedRoleIds = roleIds as string[];

  const currentResult = await client.query<RolePermissionRow>(
    `SELECT id, role_id, permission_id
       FROM ${TABLES.identity.role_permissions}
      WHERE role_id = ANY($1::uuid[])
      FOR UPDATE`,
    [persistedRoleIds],
  );
  const currentByPair = new Map(
    currentResult.rows.map((row) => [`${row.role_id}:${row.permission_id}`, row]),
  );
  const targetPairs = new Set<string>();

  for (const role of manifest.roles) {
    const roleId = roles.get(role.code)?.id;
    if (!roleId) throw new Error(`Role '${role.code}' has no database id.`);
    for (const code of role.permissions) {
      const permissionId = permissions.get(code)?.id;
      if (!permissionId) {
        throw new Error(`Permission '${code}' has no database id.`);
      }
      targetPairs.add(`${roleId}:${permissionId}`);
    }
  }

  let removed = 0;
  for (const [pair, row] of currentByPair) {
    if (!targetPairs.has(pair)) {
      await client.query(`DELETE FROM ${TABLES.identity.role_permissions} WHERE id = $1`, [row.id]);
      removed += 1;
    }
  }

  let created = 0;
  for (const pair of targetPairs) {
    if (currentByPair.has(pair)) continue;
    const [roleId, permissionId] = pair.split(':');
    await client.query(
      `INSERT INTO ${TABLES.identity.role_permissions} (role_id, permission_id)
       VALUES ($1, $2)`,
      [roleId, permissionId],
    );
    created += 1;
  }

  return { created, removed };
}

async function seedIdentityMasterData(database: PostgresDatabase): Promise<SeedSummary> {
  validateSeedManifest();

  const defaultRoleCode = process.env.DEFAULT_ROLE_CODE ?? 'customer';
  return database.transaction(async (client) => {
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [
      'identity-master-data-seed-v2',
    ]);

    const permissions = await upsertPermissions(client);
    const roles = await upsertRoles(client);

    if (!roles.records.has(defaultRoleCode)) {
      throw new Error(`DEFAULT_ROLE_CODE '${defaultRoleCode}' does not identify an active role.`);
    }

    const mappings = await synchronizeRolePermissions(client, roles.records, permissions.records);
    return {
      permissionsCreated: permissions.created,
      permissionsUpdated: permissions.updated,
      rolesCreated: roles.created,
      rolesUpdated: roles.updated,
      mappingsCreated: mappings.created,
      mappingsRemoved: mappings.removed,
    };
  });
}

async function main(): Promise<void> {
  validateSeedManifest();
  if (process.argv.includes('--check-only')) {
    console.log(
      `Manifest valid: ${manifest.roles.length} roles, ${manifest.permissions.length} permissions.`,
    );
    return;
  }

  const app = await NestFactory.createApplicationContext(SeedModule, { logger: false });
  try {
    const summary = await seedIdentityMasterData(app.get(PostgresDatabase));
    console.log(
      'Identity master data seeded: ' +
        `permissions(created=${summary.permissionsCreated}, updated=${summary.permissionsUpdated}), ` +
        `roles(created=${summary.rolesCreated}, updated=${summary.rolesUpdated}), ` +
        `mappings(created=${summary.mappingsCreated}, removed=${summary.mappingsRemoved}).`,
    );
  } finally {
    await app.close();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
