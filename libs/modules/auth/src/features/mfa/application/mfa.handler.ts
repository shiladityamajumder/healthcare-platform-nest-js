// Linked with: @nestjs/common.
// Used by: the feature module/controller and the domain or infrastructure ports it coordinates.
// Other linkup: This layer keeps transport concerns separate from domain rules and persistence details.
import { Injectable } from '@nestjs/common';

// Coordinate the use case while keeping transport and persistence concerns outside this class.
@Injectable()
export class MfaHandler {
  async execute(_input: unknown): Promise<Record<string, unknown>> {
    // TODO: orchestrate domain rules through ports. No SQL/ORM code belongs here.
    return { feature: 'mfa', status: 'not-implemented' };
  }
}
