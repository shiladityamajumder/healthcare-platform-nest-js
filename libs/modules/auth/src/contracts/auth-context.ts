/**
 * HTTP context and request-input helpers shared by auth controllers and services.
 * Used backward by feature controllers; connects forward as normalized service input.
 */
export type AuthRequestHeaders = Record<string, string | string[] | undefined>;

export function toAuthInput(input: object): Record<string, unknown> {
  return input as Record<string, unknown>;
}

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
