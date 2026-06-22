import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '../../../i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <div className="about">
      <h3>
        {t('author')}:{' '}
        <a
          target="_blank"
          href="https://github.com/obemgcabazn"
          rel="noreferrer"
        >
          @obemgcabazn
        </a>
      </h3>
      <h3>
        <a href="https://rs.school/courses/reactjs">{t('course')}</a>
      </h3>
    </div>
  );
}
