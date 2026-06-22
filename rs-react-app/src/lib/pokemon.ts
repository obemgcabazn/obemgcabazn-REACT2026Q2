const PAGE_SIZE = 10;

export interface PokemonInList {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };
}

export async function fetchPokemonList(page: string): Promise<PokemonInList[]> {
  const offset = (Number(page) - 1) * PAGE_SIZE;
  const resp = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=${PAGE_SIZE}&offset=${offset}`,
    { next: { revalidate: 300 } }
  );
  const data: { results: PokemonInList[] } = await resp.json();
  return data.results;
}

export async function fetchPokemonByName(name: string): Promise<PokemonDetail> {
  const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`, {
    next: { revalidate: 300 },
  });
  if (!resp.ok) {
    throw new Error(String(resp.status));
  }
  return resp.json() as Promise<PokemonDetail>;
}
