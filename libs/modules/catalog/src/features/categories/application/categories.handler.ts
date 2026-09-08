import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesHandler {
  async execute(_input: unknown): Promise<Record<string, unknown>> {
    // TODO: orchestrate domain rules through ports. No SQL/ORM code belongs here.
    return { feature: 'categories', status: 'not-implemented' };
  }
}
