'use client';
import './header.scss';
import TestError from './TestError.tsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from './ThemeSwitcher.tsx';
import { useQueryClient } from '@tanstack/react-query';

export const Header = () => {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const refreshCache = () => {
    queryClient.clear();
  };

  return (
    <header>
      <div className="container flex-aic-sb">
        <h3>Pokemon Searching App</h3>
        <nav>
          <Link
            href="/"
            className={`button__main ${pathname === '/' ? 'active' : ''}`}
          >
            Main Page
          </Link>
          <Link
            href="/about"
            className={`button__main ${pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>
          <TestError />
          <button className="button__main" onClick={refreshCache}>
            Refresh
          </button>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
};
