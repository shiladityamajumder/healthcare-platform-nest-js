/** Parameterized SQL projections shared by the authentication repositories. */
export const AUTH_USER_SELECT = `
  SELECT u.id, u.email, u.email_verified_at, u.phone_country_code, u.phone_number,
         u.phone_verified_at, u.status, u.preferred_locale, u.timezone,
         p.first_name, p.last_name, p.preferred_name, p.avatar_file_id,
         f.public_url AS avatar_url
  FROM identity.users u
  LEFT JOIN identity.user_profiles p ON p.user_id = u.id AND p.is_deleted = false
  LEFT JOIN platform.file_objects f ON f.id = p.avatar_file_id
    AND f.status = 'available' AND f.access_type = 'public' AND f.malware_scan_status = 'clean'`;
