import { describe, it, expect, beforeEach } from 'vitest';
import { useFormResults } from '../Store/Store';

const makeItem = (overrides = {}) => ({
  source: 'rhf' as const,
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  image: '',
  password: 'Secret1!',
  privacy: true,
  country: 'Germany',
  ...overrides,
});

describe('useFormResults store', () => {
  beforeEach(() => {
    useFormResults.setState({ formsResults: [] });
  });

  it('starts with empty formsResults', () => {
    expect(useFormResults.getState().formsResults).toEqual([]);
  });

  it('has a non-empty countries list containing known countries', () => {
    const { countries } = useFormResults.getState();
    expect(countries.length).toBeGreaterThan(0);
    expect(countries).toContain('Germany');
    expect(countries).toContain('United States');
    expect(countries).toContain('France');
  });

  it('addResult appends an item and returns correct state', () => {
    const item = makeItem();
    useFormResults.getState().addResult(item);
    const { formsResults } = useFormResults.getState();
    expect(formsResults).toHaveLength(1);
    expect(formsResults[0]).toEqual(item);
  });

  it('addResult accumulates multiple results immutably', () => {
    const item1 = makeItem({ name: 'Alice', source: 'uncontrolled' as const });
    const item2 = makeItem({ name: 'Bob', source: 'rhf' as const });
    useFormResults.getState().addResult(item1);
    const snapFirst = useFormResults.getState().formsResults[0];
    useFormResults.getState().addResult(item2);
    const { formsResults } = useFormResults.getState();
    expect(formsResults).toHaveLength(2);
    expect(formsResults[0]).toEqual(snapFirst);
    expect(formsResults[1].name).toBe('Bob');
  });

  it('supports items with optional gender field', () => {
    const item = makeItem({ gender: 'female' });
    useFormResults.getState().addResult(item);
    expect(useFormResults.getState().formsResults[0].gender).toBe('female');
  });
});
