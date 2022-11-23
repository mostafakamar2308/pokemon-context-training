import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

type Pokemon = {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
};

function usePokemonSource(): {
  pokemon: Pokemon[];
  name: string;
  setName: (name: string) => void;
} {
  type PokemonState = {
    pokemon: Pokemon[];
    name: string;
  };
  type PokemonAction =
    | { type: "setPokemon"; payload: Pokemon[] }
    | { type: "setSearch"; payload: string };

  const [{ pokemon, name }, dispatch] = useReducer(
    (state: PokemonState, action: PokemonAction) => {
      switch (action.type) {
        case "setPokemon":
          return { ...state, pokemon: action.payload };
        case "setSearch":
          return { ...state, name: action.payload };
      }
    },
    {
      pokemon: [],
      name: "",
    }
  );
  useEffect(() => {
    fetch("/pokemon.json")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "setPokemon", payload: data }));
  }, []);

  const setName = useCallback((name: string) => {
    dispatch({ type: "setSearch", payload: name });
  }, []);

  const filteredList = useMemo(
    () =>
      pokemon.filter((p) => p.name.toLowerCase().includes(name.toLowerCase())),
    [name, pokemon]
  );

  const SortedList = useMemo(
    () =>
      [...filteredList]
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 20),
    [filteredList]
  );

  return { pokemon: SortedList, name, setName };
}

const pokemonContext = createContext<ReturnType<typeof usePokemonSource>>(
  {} as unknown as ReturnType<typeof usePokemonSource>
);

export function usePokemonProvider() {
  return useContext(pokemonContext);
}

export function PokemonProvider({ children }: { children: React.ReactNode }) {
  return (
    <pokemonContext.Provider value={usePokemonSource()}>
      {children}
    </pokemonContext.Provider>
  );
}
