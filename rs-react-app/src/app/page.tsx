import { Suspense } from 'react';
import PokemonPage from '../components/PokemonPage';
import Spinner from '../components/Spinner';

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <PokemonPage />
    </Suspense>
  );
}
