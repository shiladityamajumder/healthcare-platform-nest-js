// * Auth module: Normalizes and validates identity values used by authentication flows.
// * File: src/features/identity/identity.validation.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Canonical email and phone normalization rules for identity lookup.
 * Used backward by registration, login, and password recovery; connects forward to identity repositories.
 */
import { ValidationError } from '@shared/errors';

// * Function [normalizeEmail]: Transforms the supplied value into the format required by this authentication flow.
export function normalizeEmail(value: string): string {
  const email = value?.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    throw new ValidationError('The email address is invalid.');
  return email;
}

// * Function [normalizePhone]: Transforms the supplied value into the format required by this authentication flow.
export function normalizePhone(country: string, number: string): [string, string] {
  const code = country?.trim().replaceAll(' ', '');
  const phone = number?.trim().replace(/[\s().-]+/g, '');
  if (!/^\+?[1-9][0-9]{0,2}$/.test(code ?? ''))
    throw new ValidationError('The phone country code is invalid.');
  const normalizedCode = code.startsWith('+') ? code : `+${code}`;
  if (!/^[0-9]{6,14}$/.test(phone ?? '') || phone.startsWith('+'))
    throw new ValidationError('The phone number is invalid.');
  return [normalizedCode, phone];
}
