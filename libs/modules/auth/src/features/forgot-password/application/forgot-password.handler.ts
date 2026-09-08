import { Injectable } from '@nestjs/common';

@Injectable()
export class ForgotPasswordHandler {
  async execute(_input: unknown): Promise<Record<string, unknown>> {
    // TODO: orchestrate domain rules through ports. No SQL/ORM code belongs here.
    return { feature: 'forgot-password', status: 'not-implemented' };
  }
}
