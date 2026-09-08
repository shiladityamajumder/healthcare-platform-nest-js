import { Injectable } from '@nestjs/common';

@Injectable()
export class RegistrationHandler {
  async execute(_input: unknown): Promise<Record<string, unknown>> {
    // TODO: orchestrate domain rules through ports. No SQL/ORM code belongs here.
    return { feature: 'registration', status: 'not-implemented' };
  }
}
