import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookHandler {
  async execute(_input: unknown): Promise<Record<string, unknown>> {
    // TODO: orchestrate domain rules through ports. No SQL/ORM code belongs here.
    return { feature: 'webhook', status: 'not-implemented' };
  }
}
