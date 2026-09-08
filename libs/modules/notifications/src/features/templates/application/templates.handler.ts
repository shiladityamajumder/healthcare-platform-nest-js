import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplatesHandler {
  async execute(_input: unknown): Promise<Record<string, unknown>> {
    // TODO: orchestrate domain rules through ports. No SQL/ORM code belongs here.
    return { feature: 'templates', status: 'not-implemented' };
  }
}
