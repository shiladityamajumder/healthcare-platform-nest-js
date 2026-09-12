export function authContext(
  headers: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> {
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
