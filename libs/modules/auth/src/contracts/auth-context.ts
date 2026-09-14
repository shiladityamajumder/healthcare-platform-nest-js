// * Auth module: Normalizes request context and converts controller input for auth services.
// * File: src/contracts/auth-context.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * HTTP context and request-input helpers shared by auth controllers and services.
 * Used backward by feature controllers; connects forward as normalized service input.
 */
export type AuthRequestHeaders = Record<string, string | string[] | undefined>;

// * Function [toAuthInput]: Handles the toAuthInput operation for this authentication component.
export function toAuthInput(input: object): Record<string, unknown> {
  return input as Record<string, unknown>;
}

// * Function [authContext]: Handles the authContext operation for this authentication component.
export function authContext(headers: AuthRequestHeaders): Record<string, string | undefined> {
  const value = (key: string): string | undefined => {
    const raw = headers[key] ?? headers[key.toLowerCase()];
    return Array.isArray(raw) ? raw[0] : raw;
  };

  return {
    deviceId: value('x-device-id'),
    deviceType: value('x-device-type'),
    ipAddress: value('x-forwarded-for'),
    userAgent: value('user-agent'),
  };
}
