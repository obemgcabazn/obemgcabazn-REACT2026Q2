import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';
import { Header } from '../components/Header';
import { IntlWrapper } from './test-utils';

vi.mock('../i18n/navigation', () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

vi.mock('../components/ThemeSwitcher', () => ({
  ThemeSwitcher: () => <button>Theme</button>,
}));

vi.mock('../components/TestError', () => ({
  default: () => <button>Test Error</button>,
}));

vi.mock('../components/LanguageSwitcher', () => ({
  default: () => <div>LangSwitcher</div>,
}));

const renderHeader = (queryClient?: QueryClient) => {
  const client = queryClient ?? new QueryClient();
  return {
    queryClient: client,
    ...render(
      <IntlWrapper>
        <QueryClientProvider client={client}>
          <Header />
        </QueryClientProvider>
      </IntlWrapper>
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
