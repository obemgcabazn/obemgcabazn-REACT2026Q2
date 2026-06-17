import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';
import { Header } from '../components/Header';

vi.mock('../components/ThemeSwitcher', () => ({
  ThemeSwitcher: () => <button>Theme</button>,
}));

vi.mock('../components/TestError', () => ({
  default: () => <button>Test Error</button>,
}));

const renderHeader = (queryClient?: QueryClient) => {
  const client = queryClient ?? new QueryClient();
  return {
    queryClient: client,
    ...render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </QueryClientProvider>
    ),
  };
};

describe('Header', () => {
  it('renders Refresh button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });

  it('calls queryClient.clear() when Refresh is clicked', async () => {
    const queryClient = new QueryClient();
    const clearSpy = vi.spyOn(queryClient, 'clear');

    renderHeader(queryClient);

    await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(clearSpy).toHaveBeenCalledOnce();
  });
});
