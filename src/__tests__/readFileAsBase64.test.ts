import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileAsBase64 } from '../utilities/readFileAsBase64';

describe('readFileAsBase64', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('resolves with the data URL on success', async () => {
    const fakeResult = 'data:image/png;base64,abc123';

    class MockFileReader {
      result = fakeResult;
      onload: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      readAsDataURL(_file: File) {
        queueMicrotask(() => this.onload?.());
      }
    }
    vi.stubGlobal('FileReader', MockFileReader);

    const file = new File(['x'], 'a.png', { type: 'image/png' });
    await expect(readFileAsBase64(file)).resolves.toBe(fakeResult);
  });

  it('rejects on reader error', async () => {
    const fakeError = new Error('read failed');

    class MockFileReader {
      result: string | null = null;
      onload: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      readAsDataURL(_file: File) {
        queueMicrotask(() => this.onerror?.(fakeError));
      }
    }
    vi.stubGlobal('FileReader', MockFileReader);

    const file = new File(['x'], 'a.png', { type: 'image/png' });
    await expect(readFileAsBase64(file)).rejects.toBe(fakeError);
  });
});
