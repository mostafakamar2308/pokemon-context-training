import "./App.css";
import { usePokemonProvider, PokemonProvider } from "./store";

function PokemonList() {
  const { pokemon } = usePokemonProvider();
  return (
    <div>
      {pokemon &&
        pokemon.map((ele) => (
          <div key={ele.id}>
            <img
              loading="lazy"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${ele.id}.png`}
            />
            <h2>{ele.name}</h2>
          </div>
        ))}
    </div>
  );
}

function SearchBox() {
  const { setName, name } = usePokemonProvider();
  return (
    <input
      placeholder="Search"
      value={name}
      onChange={(e) => setName(e.target.value)}
    ></input>
  );
}
function App() {
  return (
    <PokemonProvider>
      <SearchBox />
      <PokemonList></PokemonList>
    </PokemonProvider>
  );
}

export default App;
