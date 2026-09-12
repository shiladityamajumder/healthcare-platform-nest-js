/**
 * Builds the public auth capability document and exposes configured signing keys.
 * Used backward by CapabilitiesController; connects forward to AuthTokenService for JWKS data.
 */
import { Injectable } from '@nestjs/common';
import { NotFoundError } from '@shared/errors';
import { AuthTokenService } from '../../infrastructure/token/auth-token.service';

@Injectable()
export class CapabilitiesService {
  public constructor(private readonly tokens: AuthTokenService) {}

  capabilities() {
    return {
      schema: 'auth-capabilities',
      registration: { emailEnabled: true, phoneEnabled: true },
      login: { passwordEnabled: true, phoneOtpEnabled: true },
      verification: {
        emailRequired: process.env.EMAIL_VERIFICATION_REQUIRED !== 'false',
        phoneRequired: process.env.PHONE_VERIFICATION_REQUIRED !== 'false',
      },
      passwordPolicy: {
        minimumLength: Number(process.env.PASSWORD_MIN_LENGTH ?? 8),
        minimumCharacterClasses: 3,
      },
      supportedPlatforms: ['android', 'ios', 'web'],
    };
  }

  jwks() {
    const keys = this.tokens.jwks();
    if (!keys.length) throw new NotFoundError('JWKS is available only when RS256 is configured.');
    return { keys };
  }
}
