import { CatalogConflictError, slugify, validateStatusTransition } from './catalog.rules';
import { actorId } from './catalog-context';

describe('catalog domain rules', () => {
  it('creates stable URL-safe slugs', () => {
    expect(slugify('  Crocin Advance 500 mg  ')).toBe('crocin-advance-500-mg');
  });

  it('allows supported product lifecycle transitions', () => {
    expect(() => validateStatusTransition('draft', 'review')).not.toThrow();
    expect(() => validateStatusTransition('active', 'recalled')).not.toThrow();
  });

  it('rejects lifecycle transitions that bypass catalogue rules', () => {
    expect(() => validateStatusTransition('recalled', 'active')).toThrow(CatalogConflictError);
  });

  it('accepts only canonical UUID audit actors', () => {
    expect(actorId('550e8400-e29b-41d4-a716-446655440000')).toBe(
      '550e8400-e29b-41d4-a716-446655440000',
    );
    expect(actorId('not-a-user')).toBeNull();
  });
});
