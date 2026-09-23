// * Auth module: Exposes authentication capability and public key discovery endpoints.
// * File: src/features/capabilities/capabilities.controller.ts
// ? Keep this boundary focused on authentication concerns and its declared dependencies.
// ! Do not weaken validation, authorization, token, or transaction guarantees in this file.
/**
 * Public capability and JWKS discovery routes.
 * Used backward by external clients through Nest routing; connects forward to CapabilitiesService.
 * These read-only discovery endpoints are explicitly non-transactional.
 */
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NonTransactional } from '@platform/execution';
import { CapabilitiesService } from './capabilities.service';
import { ApiAuthErrors, ApiAuthOperation, ApiAuthResponse } from '../../contracts/swagger';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
@ApiAuthErrors({
  notFound:
    'Signing-key metadata is unavailable when the server is not configured with a public-key algorithm such as RS256.',
  unavailable:
    'The discovery dependency is temporarily unavailable. The frontend may use previously cached capability metadata where safe.',
})
export class CapabilitiesController {
  // * Function [constructor]: Initializes the component with its required dependencies.
  public constructor(private readonly service: CapabilitiesService) {}

  @Get('capabilities')
  @NonTransactional()
  @ApiAuthOperation(
    'Get auth capabilities',
    'Describes enabled registration, login, verification, password-policy, and supported-platform capabilities for clients.',
  )
  @ApiAuthResponse('Auth capabilities returned.', {
    schema: 'auth-capabilities',
    registration: { emailEnabled: true, phoneEnabled: true },
    login: { passwordEnabled: true, phoneOtpEnabled: true },
    verification: { emailRequired: true, phoneRequired: true },
    passwordPolicy: { minimumLength: 8, minimumCharacterClasses: 3 },
    supportedPlatforms: ['android', 'ios', 'web'],
  })
  /**
   * Lets a frontend determine which registration, login, verification, password, and platform
   * capabilities are enabled before rendering auth screens.
   */
  capabilities() {
    return this.service.capabilities();
  }

  @Get('.well-known/jwks.json')
  @NonTransactional()
  @ApiAuthOperation(
    'Get signing-key metadata',
    'Returns the public signing keys used by clients to verify tokens. The current HMAC configuration may return a not-found response because it has no public JWKS.',
  )
  @ApiAuthResponse('Signing-key metadata returned.', {
    keys: [{ kty: 'RSA', kid: 'auth-key-1', use: 'sig', alg: 'RS256' }],
  })
  /**
   * Publishes public signing-key metadata for token verification by compatible clients. This is
   * discovery metadata, not a login endpoint, and it does not require a bearer token.
   */
  jwks() {
    return this.service.jwks();
  }
}
