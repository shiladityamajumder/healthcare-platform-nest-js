import { Injectable } from '@nestjs/common';

@Injectable()
export class ResetPasswordHandler {
  async execute(_input: unknown): Promise<Record<string, unknown>> {
    // TODO: orchestrate domain rules through ports. No SQL/ORM code belongs here.
    return { feature: 'reset-password', status: 'not-implemented' };
  }
}
