import { beforeEach, describe, expect } from 'vitest';
import storageHelper from '../controller/StorageHelper.ts';
import StorageHelper from '../controller/StorageHelper.ts';

describe('StorageHelper', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Save in storage', () => {
    const result = storageHelper.set('searchQuery', 'pikachu');
    expect(result).toBe(true);
    expect(localStorage.getItem('searchQuery')).toBe('"pikachu"');
  });

  it('Get from storage', () => {
    StorageHelper.set('searchQuery', 'charizard');
    expect(StorageHelper.get('searchQuery')).toBe('charizard');
  });

  it('throw error in JSON.stringify', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    const result = StorageHelper.set('bad', circular);

    expect(result).toBe(false);
  });

  it('key not exist', () => {
    expect(StorageHelper.get('nonExistentKey')).toBeNull();
  });
});
