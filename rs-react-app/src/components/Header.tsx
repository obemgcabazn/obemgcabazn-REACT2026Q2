'use client';
import './header.scss';
import TestError from './TestError';
import { Link, usePathname } from '../i18n/navigation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export const Header = () => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const t = useTranslations('header');

  const refreshCache = () => {
    queryClient.clear();
  };

  return (
    <header>
      <div className="container flex-aic-sb">
        <h3>{t('title')}</h3>
        <nav>
          <Link
            href="/"
            className={`button__main ${pathname === '/' ? 'active' : ''}`}
          >
            {t('mainPage')}
          </Link>
          <Link
            href="/about"
            className={`button__main ${pathname === '/about' ? 'active' : ''}`}
          >
            {t('about')}
          </Link>
          <TestError />
          <button className="button__main" onClick={refreshCache}>
            {t('refresh')}
          </button>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};
