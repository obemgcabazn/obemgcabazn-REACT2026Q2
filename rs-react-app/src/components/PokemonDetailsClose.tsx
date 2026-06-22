'use client';

import Image from 'next/image';
import close from '../assets/close.svg';
import { useTranslations } from 'next-intl';
import { useRouter } from '../i18n/navigation';

interface Props {
  currentPage: string;
  locale: string;
}

export default function PokemonDetailsClose({ currentPage, locale }: Props) {
  const t = useTranslations('details');
  const router = useRouter();

  const closeDetails = () => {
    router.push(`/?page=${currentPage}`, { locale });
  };

  return (
    <>
      <div className="overlay" onClick={closeDetails}></div>
      <button
        className="button__main pokemon-details__close-button"
        onClick={closeDetails}
      >
        <Image src={close} alt="" width={16} height={16} /> {t('close')}
      </button>
    </>
  );
}
