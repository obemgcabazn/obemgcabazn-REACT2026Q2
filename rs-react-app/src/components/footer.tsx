'use client';
import './footer.scss';
import useStore from '../store/Store';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const { selectedPokemons, clearPokemons } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const t = useTranslations('footer');

  const downloadPokemonsCSV = async () => {
    try {
      setIsLoading(true);
      const resp = await fetch('/api/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pokemons: selectedPokemons }),
      });
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      if (linkRef.current) {
        linkRef.current.href = url;
        linkRef.current.download = `${selectedPokemons.length}_items.csv`;
        linkRef.current.click();
      }
      URL.revokeObjectURL(url);
    } catch {
      /* download error */
    } finally {
      setIsLoading(false);
    }
  };

  return (
    selectedPokemons.length > 0 && (
      <footer className="footer">
        <a ref={linkRef} style={{ display: 'none' }} />
        <div className="container">
          <div>{t('totalSelected', { count: selectedPokemons.length })}</div>
          <button className="button__main" onClick={clearPokemons}>
            {t('unselectAll')}
          </button>
          <button
            className="button__main"
            onClick={downloadPokemonsCSV}
            disabled={isLoading}
          >
            {isLoading && <span className="btn-spinner" />}
            {t('download')}
          </button>
        </div>
      </footer>
    )
  );
};

export default Footer;
