import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useLocalStorage from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when key is not in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('searchQuery', JSON.stringify('pikachu'));
    const { result } = renderHook(() => useLocalStorage('searchQuery', ''));
    expect(result.current[0]).toBe('pikachu');
  });

  it('updates state and persists to localStorage on set', () => {
    const { result } = renderHook(() => useLocalStorage('searchQuery', ''));
    act(() => {
      result.current[1]('charizard');
    });
    expect(result.current[0]).toBe('charizard');
    expect(localStorage.getItem('searchQuery')).toBe('"charizard"');
  });

  it('handles write error gracefully', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceeded');
      });

    const { result } = renderHook(() => useLocalStorage('key', ''));
    act(() => {
      result.current[1]('value');
    });

    expect(consoleError).toHaveBeenCalled();
    setItemSpy.mockRestore();
    consoleError.mockRestore();
  });

  it('returns null for non-existent key with null initial value', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string | null>('nonExistentKey', null)
    );
    expect(result.current[0]).toBeNull();
  });
});
