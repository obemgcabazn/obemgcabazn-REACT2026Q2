import './footer.scss';
import useStore from '../store/store.tsx';
import { useState } from 'react';
import type { Pokemon } from 'pokeapi-typescript';
import ErrorHandler from './ErrorHandler.tsx';

const Footer = () => {
  const { selectedPokemons, clearPokemons } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const downloadPokemonsCSV = async () => {
    try {
      setIsLoading(true);
      const resp = await Promise.all(
        selectedPokemons.map((name) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
        )
      );
      const data: Pokemon[] = await Promise.all(resp.map((r) => r.json()));
      const header = 'name,id,types,details URL,height,weight,base_experience';
      const rows = data.map((pokemon) => {
        const types = pokemon.types.map((t) => t.type.name).join(' | ');
        return [
          pokemon.name,
          pokemon.id,
          `"${types}"`,
          pokemon.species.url,
          pokemon.height,
          pokemon.weight,
          pokemon.base_experience,
        ].join(',');
      });
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedPokemons.length}_items.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Error while loading data')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    selectedPokemons.length > 0 && (
      <footer className="footer">
        <div className="container">
          <div>
            Total selected pokemons: <span>{selectedPokemons.length}</span>
          </div>
          <button className="button__main" onClick={clearPokemons}>
            Unselect all
          </button>
          <button
            className="button__main"
            onClick={downloadPokemonsCSV}
            disabled={isLoading}
          >
            {isLoading && <span className="btn-spinner" />}Download
          </button>
          {error && <ErrorHandler errorData={error} />}
        </div>
      </footer>
    )
  );
};

export default Footer;
