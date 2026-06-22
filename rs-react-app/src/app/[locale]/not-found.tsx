import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="text-center">
      <h1>{t('title')}</h1>
      <Link href="/">{t('link')}</Link>
    </div>
  );
}
