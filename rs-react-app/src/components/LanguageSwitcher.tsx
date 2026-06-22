'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../i18n/navigation';
import { routing } from '../i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="language-switcher">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          className={`button__main ${loc === locale ? 'active' : ''}`}
          onClick={() => switchLocale(loc)}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
