-- Auth SQL is kept in source control and executed only through parameterized pg queries.

-- name: identity.user-select
SELECT u.id,
       u.email,
       u.email_verified_at,
       u.phone_country_code,
       u.phone_number,
       u.phone_verified_at,
       u.status,
       u.preferred_locale,
       u.timezone,
       p.first_name,
       p.last_name,
       p.preferred_name,
       p.avatar_file_id,
       f.public_url AS avatar_url,
       count(*) OVER() AS total_count
FROM identity.users u
LEFT JOIN identity.user_profiles p ON p.user_id = u.id AND p.is_deleted = false
LEFT JOIN platform.file_objects f ON f.id = p.avatar_file_id
  AND f.status = 'available'
  AND f.access_type = 'public'
  AND f.malware_scan_status = 'clean'

-- name: identity.user-select-credentials
SELECT u.id,
       u.email,
       u.email_verified_at,
       u.phone_country_code,
       u.phone_number,
       u.phone_verified_at,
       u.status,
       u.preferred_locale,
       u.timezone,
       u.password_hash,
       u.locked_until,
       u.failed_login_count,
       p.first_name,
       p.last_name,
       p.preferred_name,
       p.avatar_file_id,
       f.public_url AS avatar_url,
       count(*) OVER() AS total_count
FROM identity.users u
LEFT JOIN identity.user_profiles p ON p.user_id = u.id AND p.is_deleted = false
LEFT JOIN platform.file_objects f ON f.id = p.avatar_file_id
  AND f.status = 'available'
  AND f.access_type = 'public'
  AND f.malware_scan_status = 'clean'

-- name: identity.find-user-by-id
{{identity.user-select}}
WHERE u.id = $1

-- name: identity.find-user-by-email
{{identity.user-select}}
WHERE u.email_normalized = $1

-- name: identity.find-user-by-phone
{{identity.user-select}}
WHERE u.phone_country_code = $1 AND u.phone_number = $2

-- name: identity.find-user-for-login-email
{{identity.user-select-credentials}}
WHERE u.email_normalized = $1

-- name: identity.find-user-for-login-phone
{{identity.user-select-credentials}}
WHERE u.phone_country_code = $1 AND u.phone_number = $2

-- name: identity.find-principal
SELECT s.id AS session_id,
       u.id AS user_id,
       COALESCE(array_agg(DISTINCT r.code) FILTER (WHERE r.code IS NOT NULL), ARRAY[]::text[]) AS roles,
       COALESCE(array_agg(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL), ARRAY[]::text[]) AS permissions
FROM identity.sessions s
JOIN identity.users u ON u.id = s.user_id AND u.status = 'active'
LEFT JOIN identity.user_roles ur ON ur.user_id = u.id
  AND ur.is_active = true
  AND (ur.valid_from IS NULL OR ur.valid_from <= now())
  AND (ur.valid_until IS NULL OR ur.valid_until > now())
LEFT JOIN identity.roles r ON r.id = ur.role_id AND r.is_deleted = false
LEFT JOIN identity.role_permissions rp ON rp.role_id = r.id
LEFT JOIN identity.permissions p ON p.id = rp.permission_id AND p.is_deleted = false
WHERE s.id = $1
  AND s.user_id = $2
  AND s.revoked_at IS NULL
  AND s.expires_at > now()
GROUP BY s.id, u.id

-- name: identity.create-user
WITH inserted AS (
  INSERT INTO identity.users
    (email, email_normalized, phone_country_code, phone_number, password_hash, status,
     preferred_locale, timezone, terms_version, privacy_version, created_by, updated_by)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11)
  RETURNING id
)
{{identity.user-select}}
JOIN inserted i ON i.id = u.id

-- name: identity.update-user
WITH updated AS (
  UPDATE identity.users
  SET status = CASE WHEN $2::jsonb ? 'status' THEN $2::jsonb->>'status' ELSE status END,
      preferred_locale = CASE WHEN $2::jsonb ? 'preferred_locale' THEN $2::jsonb->>'preferred_locale' ELSE preferred_locale END,
      timezone = CASE WHEN $2::jsonb ? 'timezone' THEN $2::jsonb->>'timezone' ELSE timezone END,
      email_verified_at = CASE WHEN $2::jsonb ? 'email_verified_at' THEN NULLIF($2::jsonb->>'email_verified_at', '')::timestamptz ELSE email_verified_at END,
      phone_verified_at = CASE WHEN $2::jsonb ? 'phone_verified_at' THEN NULLIF($2::jsonb->>'phone_verified_at', '')::timestamptz ELSE phone_verified_at END,
      password_hash = CASE WHEN $2::jsonb ? 'password_hash' THEN $2::jsonb->>'password_hash' ELSE password_hash END,
      last_login_at = CASE WHEN $2::jsonb ? 'last_login_at' THEN NULLIF($2::jsonb->>'last_login_at', '')::timestamptz ELSE last_login_at END,
      failed_login_count = CASE WHEN $2::jsonb ? 'failed_login_count' THEN ($2::jsonb->>'failed_login_count')::int ELSE failed_login_count END,
      locked_until = CASE WHEN $2::jsonb ? 'locked_until' THEN NULLIF($2::jsonb->>'locked_until', '')::timestamptz ELSE locked_until END,
      account_closed_at = CASE WHEN $2::jsonb ? 'account_closed_at' THEN NULLIF($2::jsonb->>'account_closed_at', '')::timestamptz ELSE account_closed_at END,
      updated_at = now(),
      row_version = row_version + 1
  WHERE id = $1
  RETURNING id
)
{{identity.user-select}}
JOIN updated ON updated.id = u.id

-- name: identity.upsert-profile
INSERT INTO identity.user_profiles
  (user_id, first_name, last_name, preferred_name, avatar_file_id)
VALUES ($1,
        CASE WHEN $2::jsonb ? 'firstName' THEN $2::jsonb->>'firstName' ELSE NULL END,
        CASE WHEN $2::jsonb ? 'lastName' THEN $2::jsonb->>'lastName' ELSE NULL END,
        CASE WHEN $2::jsonb ? 'preferredName' THEN $2::jsonb->>'preferredName' ELSE NULL END,
        CASE WHEN $2::jsonb ? 'avatarFileId' THEN NULLIF($2::jsonb->>'avatarFileId', '')::uuid ELSE NULL END)
ON CONFLICT (user_id) DO UPDATE SET
  first_name = CASE WHEN $2::jsonb ? 'firstName' THEN EXCLUDED.first_name ELSE identity.user_profiles.first_name END,
  last_name = CASE WHEN $2::jsonb ? 'lastName' THEN EXCLUDED.last_name ELSE identity.user_profiles.last_name END,
  preferred_name = CASE WHEN $2::jsonb ? 'preferredName' THEN EXCLUDED.preferred_name ELSE identity.user_profiles.preferred_name END,
  avatar_file_id = CASE WHEN $2::jsonb ? 'avatarFileId' THEN EXCLUDED.avatar_file_id ELSE identity.user_profiles.avatar_file_id END,
  updated_at = now(),
  row_version = identity.user_profiles.row_version + 1
WHERE identity.user_profiles.is_deleted = false

-- name: identity.find-role-by-code
SELECT id FROM identity.roles WHERE code = $1 AND is_deleted = false

-- name: identity.assign-role
INSERT INTO identity.user_roles (user_id, role_id, created_by, updated_by)
VALUES ($1,$2,$3,$3)
ON CONFLICT (user_id, role_id, scope_type, scope_id) DO UPDATE
SET is_active = true,
    updated_at = now(),
    row_version = identity.user_roles.row_version + 1

-- name: identity.authorization
SELECT DISTINCT r.code AS role_code, p.code AS permission_code
FROM identity.user_roles ur
JOIN identity.roles r ON r.id = ur.role_id AND r.is_deleted = false
LEFT JOIN identity.role_permissions rp ON rp.role_id = r.id
LEFT JOIN identity.permissions p ON p.id = rp.permission_id AND p.is_deleted = false
WHERE ur.user_id = $1
  AND ur.is_active = true
  AND (ur.valid_from IS NULL OR ur.valid_from <= now())
  AND (ur.valid_until IS NULL OR ur.valid_until > now())

-- name: identity.list-users
{{identity.user-select}}
WHERE ($1::text IS NULL OR u.email_normalized LIKE $1 OR u.phone_number LIKE $1)
  AND ($2::text IS NULL OR u.status = $2)
ORDER BY u.created_at DESC
LIMIT $3 OFFSET $4

-- name: otp.create
INSERT INTO identity.otp_challenges
  (id, channel, destination_hash, purpose, otp_hash, expires_at, max_attempts)
VALUES ($1,$2,$3,$4,$5,$6,$7)
RETURNING id, expires_at

-- name: otp.find-for-update
SELECT id, channel, destination_hash, purpose, otp_hash, attempts, max_attempts,
       expires_at, consumed_at, blocked_at
FROM identity.otp_challenges
WHERE id = $1
FOR UPDATE

-- name: otp.consume
UPDATE identity.otp_challenges
SET attempts = $2,
    consumed_at = CASE WHEN $3 THEN now() ELSE consumed_at END,
    blocked_at = CASE WHEN $4 THEN now() ELSE blocked_at END,
    updated_at = now(),
    row_version = row_version + 1
WHERE id = $1

-- name: session.create
INSERT INTO identity.sessions
  (id, user_id, refresh_token_hash, token_family_id, device_id, device_type,
   ip_address, user_agent, expires_at)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)

-- name: session.find
SELECT id, user_id, token_family_id, refresh_token_hash, expires_at, revoked_at, device_id
FROM identity.sessions
WHERE id = $1

-- name: session.find-for-update
SELECT id, user_id, token_family_id, refresh_token_hash, expires_at, revoked_at, device_id
FROM identity.sessions
WHERE id = $1
FOR UPDATE

-- name: session.rotate
UPDATE identity.sessions
SET refresh_token_hash = $2,
    expires_at = $3,
    last_seen_at = now(),
    updated_at = now(),
    row_version = row_version + 1
WHERE id = $1 AND revoked_at IS NULL

-- name: session.revoke
UPDATE identity.sessions
SET revoked_at = COALESCE(revoked_at, now()),
    revoke_reason = $2,
    updated_at = now(),
    row_version = row_version + 1
WHERE id = $1

-- name: session.revoke-others
UPDATE identity.sessions
SET revoked_at = now(),
    revoke_reason = 'logout_others',
    updated_at = now(),
    row_version = row_version + 1
WHERE user_id = $1 AND id <> $2 AND revoked_at IS NULL

-- name: session.revoke-all
UPDATE identity.sessions
SET revoked_at = now(),
    revoke_reason = $2,
    updated_at = now(),
    row_version = row_version + 1
WHERE user_id = $1 AND revoked_at IS NULL

-- name: session.list
SELECT id, device_id, device_type, host(ip_address) AS ip_address, user_agent,
       created_at, last_seen_at, expires_at
FROM identity.sessions
WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > now()
ORDER BY last_seen_at DESC NULLS LAST, created_at DESC

-- name: administration.list-roles
SELECT id, code, name, description, is_system, created_at, updated_at
FROM identity.roles
WHERE is_deleted = false
ORDER BY code

-- name: administration.find-role
SELECT id, code, name, description, is_system, created_at, updated_at
FROM identity.roles
WHERE id = $1 AND is_deleted = false

-- name: administration.create-role
INSERT INTO identity.roles (code,name,description,created_by,updated_by)
VALUES ($1,$2,$3,$4,$4)
RETURNING id,code,name,description,is_system,created_at,updated_at

-- name: administration.update-role
UPDATE identity.roles
SET code = CASE WHEN $2::jsonb ? 'code' THEN $2::jsonb->>'code' ELSE code END,
    name = CASE WHEN $2::jsonb ? 'name' THEN $2::jsonb->>'name' ELSE name END,
    description = CASE WHEN $2::jsonb ? 'description' THEN $2::jsonb->>'description' ELSE description END,
    updated_by = $3,
    updated_at = now(),
    row_version = row_version + 1
WHERE id = $1 AND is_deleted = false
RETURNING id,code,name,description,is_system,created_at,updated_at

-- name: administration.delete-role
UPDATE identity.roles
SET is_deleted = true, deleted_at = now(), deleted_by = $2,
    updated_at = now(), row_version = row_version + 1
WHERE id = $1 AND is_system = false AND is_deleted = false

-- name: administration.list-permissions
SELECT id,code,resource,action,description,created_at,updated_at
FROM identity.permissions
WHERE is_deleted = false
ORDER BY code

-- name: administration.find-permission
SELECT id,code,resource,action,description,created_at,updated_at
FROM identity.permissions
WHERE id = $1 AND is_deleted = false

-- name: administration.create-permission
INSERT INTO identity.permissions (code,resource,action,description,created_by,updated_by)
VALUES ($1,$2,$3,$4,$5,$5)
RETURNING id,code,resource,action,description,created_at,updated_at

-- name: administration.update-permission
UPDATE identity.permissions
SET code = CASE WHEN $2::jsonb ? 'code' THEN $2::jsonb->>'code' ELSE code END,
    resource = CASE WHEN $2::jsonb ? 'resource' THEN $2::jsonb->>'resource' ELSE resource END,
    action = CASE WHEN $2::jsonb ? 'action' THEN $2::jsonb->>'action' ELSE action END,
    description = CASE WHEN $2::jsonb ? 'description' THEN $2::jsonb->>'description' ELSE description END,
    updated_by = $3,
    updated_at = now(),
    row_version = row_version + 1
WHERE id = $1 AND is_deleted = false
RETURNING id,code,resource,action,description,created_at,updated_at

-- name: administration.delete-permission
UPDATE identity.permissions
SET is_deleted = true, deleted_at = now(), deleted_by = $2,
    updated_at = now(), row_version = row_version + 1
WHERE id = $1 AND is_deleted = false

-- name: administration.role-permissions
SELECT p.id,p.code,p.resource,p.action,p.description,p.created_at,p.updated_at
FROM identity.role_permissions rp
JOIN identity.permissions p ON p.id = rp.permission_id AND p.is_deleted = false
WHERE rp.role_id = $1
ORDER BY p.code

-- name: administration.replace-role-permissions
WITH deleted AS (
  DELETE FROM identity.role_permissions WHERE role_id = $1
), inserted AS (
  INSERT INTO identity.role_permissions (role_id, permission_id, created_by, updated_by)
  SELECT $1, p.id, $3, $3
  FROM identity.permissions p
  WHERE p.id = ANY($2::uuid[]) AND p.is_deleted = false
)
SELECT p.id,p.code,p.resource,p.action,p.description,p.created_at,p.updated_at
FROM identity.role_permissions rp
JOIN identity.permissions p ON p.id = rp.permission_id AND p.is_deleted = false
WHERE rp.role_id = $1
ORDER BY p.code

-- name: administration.user-roles
SELECT ur.id,ur.user_id,ur.role_id,r.code AS role_code,r.name AS role_name,
       ur.scope_type,ur.scope_id,ur.valid_from,ur.valid_until,ur.is_active,
       ur.created_at,ur.updated_at
FROM identity.user_roles ur
JOIN identity.roles r ON r.id = ur.role_id
WHERE ur.user_id = $1
ORDER BY r.code

-- name: administration.assign-user-role
WITH inserted AS (
  INSERT INTO identity.user_roles
    (user_id,role_id,scope_type,scope_id,valid_from,valid_until,is_active,created_by,updated_by)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8)
  RETURNING id
)
SELECT ur.id,ur.user_id,ur.role_id,r.code AS role_code,r.name AS role_name,
       ur.scope_type,ur.scope_id,ur.valid_from,ur.valid_until,ur.is_active,
       ur.created_at,ur.updated_at
FROM identity.user_roles ur
JOIN inserted i ON i.id = ur.id
JOIN identity.roles r ON r.id = ur.role_id

-- name: administration.update-user-role
WITH updated AS (
  UPDATE identity.user_roles
  SET scope_type = CASE WHEN $3::jsonb ? 'scope_type' THEN $3::jsonb->>'scope_type' ELSE scope_type END,
      scope_id = CASE WHEN $3::jsonb ? 'scope_id' THEN NULLIF($3::jsonb->>'scope_id', '')::uuid ELSE scope_id END,
      valid_from = CASE WHEN $3::jsonb ? 'valid_from' THEN NULLIF($3::jsonb->>'valid_from', '')::timestamptz ELSE valid_from END,
      valid_until = CASE WHEN $3::jsonb ? 'valid_until' THEN NULLIF($3::jsonb->>'valid_until', '')::timestamptz ELSE valid_until END,
      is_active = CASE WHEN $3::jsonb ? 'is_active' THEN ($3::jsonb->>'is_active')::boolean ELSE is_active END,
      updated_by = $4,
      updated_at = now(),
      row_version = row_version + 1
  WHERE id = $2 AND user_id = $1
  RETURNING id
)
SELECT ur.id,ur.user_id,ur.role_id,r.code AS role_code,r.name AS role_name,
       ur.scope_type,ur.scope_id,ur.valid_from,ur.valid_until,ur.is_active,
       ur.created_at,ur.updated_at
FROM identity.user_roles ur
JOIN updated u ON u.id = ur.id
JOIN identity.roles r ON r.id = ur.role_id

-- name: administration.delete-user-role
DELETE FROM identity.user_roles WHERE id=$1 AND user_id=$2
