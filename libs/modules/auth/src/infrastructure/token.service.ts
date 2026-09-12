import { Injectable } from '@nestjs/common';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { AuthenticationError } from '@shared/errors';
import type { EncodedToken, TokenClaims, TokenServicePort } from '../domain/ports/auth.ports';

@Injectable()
export class AuthTokenService implements TokenServicePort {
  private readonly secret =
    process.env.JWT_SECRET ?? process.env.JWT_ACCESS_SECRET ?? 'development-jwt-secret';
  private readonly pepper = process.env.AUTH_PEPPER ?? this.secret;
  private readonly issuer = process.env.JWT_ISSUER ?? 'pharmacy-platform-identity';
  private readonly audience = process.env.JWT_AUDIENCE ?? 'pharmacy-platform';
  private readonly accessTtl = Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900);
  private readonly refreshTtl = Number(process.env.JWT_REFRESH_TTL_SECONDS ?? 2_592_000);

  public createAccess(userId: string, sessionId: string, methods: string[]): EncodedToken {
    return this.encode('access', userId, this.accessTtl, { sid: sessionId, amr: methods });
  }

  public createRefresh(userId: string, sessionId: string, familyId: string): EncodedToken {
    return this.encode('refresh', userId, this.refreshTtl, { sid: sessionId, fam: familyId });
  }

  public createReset(
    userId: string,
    challengeId: string,
    channel: string,
    destinationHash: string,
  ): EncodedToken {
    return this.encode(
      'password_reset',
      userId,
      Number(process.env.PASSWORD_RESET_TOKEN_TTL_SECONDS ?? 900),
      {
        challenge_id: challengeId,
        channel,
        destination_hash: destinationHash,
      },
    );
  }

  public decode(token: string, expected: TokenClaims['token_type']): TokenClaims {
    const parts = token.split('.');
    if (parts.length !== 3)
      throw new AuthenticationError('The supplied token is invalid or expired.');
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    try {
      const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8')) as {
        alg?: string;
        typ?: string;
      };
      if (header.alg !== 'HS256' || header.typ !== 'JWT')
        throw new Error('Unsupported token header.');
    } catch {
      throw new AuthenticationError('The supplied token is invalid or expired.');
    }
    const expectedSignature = this.sign(`${encodedHeader}.${encodedPayload}`);
    if (!safeEqual(encodedSignature, expectedSignature))
      throw new AuthenticationError('The supplied token is invalid or expired.');
    let payload: Partial<TokenClaims>;
    try {
      payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      ) as Partial<TokenClaims>;
    } catch {
      throw new AuthenticationError('The supplied token is invalid or expired.');
    }
    const now = Math.floor(Date.now() / 1000);
    if (
      payload.iss !== this.issuer ||
      payload.aud !== this.audience ||
      payload.token_type !== expected ||
      !payload.sub ||
      !payload.jti ||
      !payload.exp ||
      payload.exp <= now
    ) {
      throw new AuthenticationError('The supplied token is invalid or expired.');
    }
    return payload as TokenClaims;
  }

  public hash(value: string, namespace: string): string {
    return createHmac('sha256', this.pepper).update(`${namespace}:${value}`).digest('hex');
  }

  public otpHash(challengeId: string, code: string): string {
    return this.hash(`${challengeId}:${code}`, 'otp-code');
  }

  public jwks(): Array<Record<string, string>> {
    return [];
  }

  private encode(
    type: TokenClaims['token_type'],
    subject: string,
    ttlSeconds: number,
    extra: Record<string, unknown>,
  ): EncodedToken {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: subject,
      token_type: type,
      jti: randomUUID(),
      iat: now,
      nbf: now,
      exp: now + ttlSeconds,
      iss: this.issuer,
      aud: this.audience,
      ...extra,
    };
    const header = { typ: 'JWT', alg: 'HS256' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return {
      token: `${encodedHeader}.${encodedPayload}.${this.sign(`${encodedHeader}.${encodedPayload}`)}`,
      expiresAt: new Date((now + ttlSeconds) * 1000),
      jti: payload.jti,
    };
  }

  private sign(value: string): string {
    return createHmac('sha256', this.secret).update(value).digest('base64url');
  }
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
