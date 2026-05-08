import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';

vi.mock('./App.tsx', () => ({
  default: () => <div data-testid="app" />,
}));

const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({ render: mockRender }));

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

describe('main.tsx', () => {
  beforeEach(() => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.getElementById('root')?.remove();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('Call createRoot with #root', async () => {
    await import('../main.tsx');

    const rootEl = document.getElementById('root');
    expect(mockCreateRoot).toHaveBeenCalledWith(rootEl);
  });

  it('Call render with App component', async () => {
    await import('../main.tsx');

    expect(mockRender).toHaveBeenCalledTimes(1);
    const renderArg = mockRender.mock.calls[0][0];
    expect(renderArg.type).toBeDefined();
  });
});
