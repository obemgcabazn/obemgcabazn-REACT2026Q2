import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('ThemeProvider / useTheme', () => {
  it('provides light theme by default', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.theme).toBe('light');
  });

  it('reads initial theme from localStorage', () => {
    localStorage.setItem('theme', JSON.stringify('dark'));
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.theme).toBe('dark');
  });

  it('adds dark class to documentElement when theme is dark', () => {
    localStorage.setItem('theme', JSON.stringify('dark'));
    renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('does not add dark class when theme is light', () => {
    renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggleTheme switches from light to dark', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');
  });

  it('toggleTheme switches from dark to light', () => {
    localStorage.setItem('theme', JSON.stringify('dark'));
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');
  });

  it('toggleTheme persists new theme in localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => {
      result.current.toggleTheme();
    });
    expect(localStorage.getItem('theme')).toBe(JSON.stringify('dark'));
  });

  it('toggleTheme updates dark class on documentElement', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => {
      result.current.toggleTheme();
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggleTheme removes dark class when switching back to light', () => {
    localStorage.setItem('theme', JSON.stringify('dark'));
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => {
      result.current.toggleTheme();
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
