import { useEffect, useState } from "react";
import PokemonThumbnail from "./components/PokemonThumbnails";
import Spinner from "./components/Spinner";

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousPage, setPreviousPage] = useState("");
  const [nextPage, setNextPage] = useState("");
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showCard, setShowCard] = useState(false);

  const getAllPokemons = async (url) => {
    setIsLoading(true);
    const response = await fetch(url);
    const data = await response.json();

    setPreviousPage(data.previous);
    setNextPage(data.next);

    const newPokemons = await Promise.all(
      data.results.map(async (pokemon) => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        const data = await response.json();
        return data;
      })
    );

    setAllPokemons(newPokemons);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllPokemons("https://pokeapi.co/api/v2/pokemon?limit=16");
  }, []);

  const handleSearchChange = (searchTerm) => {
    if (searchTerm === "") {
      setFilteredPokemons([]);
    } else {
      const filteredPokemons = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemons(filteredPokemons);
    }
  };

  const openPokeInfo = (pokemon) => {
    setSelectedPokemon(pokemon);
    setShowCard(true);
  };

  const close = () => {
    setShowCard(false);
  };

  return (
    <>
      <div className="container">
        <h1 className="text-[5rem] md:text-[10rem] text-center items-center">
          Pokedex
        </h1>
        <input
          className="search border w-60 rounded-[40px] px-4 py-2"
          type="text"
          placeholder="Search Pokemon"
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <div className="pokemonContainer">
          <div className="allContainer">
            {isLoading ? (
              <Spinner />
            ) : (
              (filteredPokemons.length > 0
                ? filteredPokemons
                : allPokemons
              ).map((pokemon) => (
                <PokemonThumbnail
                  id={pokemon.id}
                  name={pokemon.name}
                  image={pokemon.sprites.other.dream_world.front_default}
                  type={pokemon.types[0].type.name}
                  key={pokemon.id}
                  openPokeInfo={() => openPokeInfo(pokemon)}
                />
              ))
            )}
          </div>
          {isLoading ? (
            " "
          ) : (
            <div className="pagination-buttons">
              {previousPage && (
                <button
                  className="btn"
                  onClick={() => getAllPokemons(previousPage)}
                >
                  Previous
                </button>
              )}
              {nextPage && (
                <button
                  className="btn"
                  onClick={() => getAllPokemons(nextPage)}
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
        {showCard && (
          <div className="card">
            {/* close btn */}
            <button className="btn-close" onClick={close}>
              X
            </button>
            <div className="header">
              <img
                src={selectedPokemon.sprites.other.dream_world.front_default}
                alt={selectedPokemon.name}
              />
              <h3 className="pokemon-header">{selectedPokemon.name}</h3>
            </div>

            <div className="species">
              <h2>Species</h2>
              <p>{selectedPokemon.name}</p>
            </div>

            <div className="stats">
              <h2>Base Stats</h2>

              <div className="stat">
                <span>
                  <p>hp</p> {selectedPokemon.stats[0].base_stat}
                </span>
                <span>
                  <p>Attack</p> {selectedPokemon.stats[1].base_stat}
                </span>
                <span>
                  <p>Defense</p> {selectedPokemon.stats[2].base_stat}
                </span>
                <span>
                  <p>Special-Attacks</p> {selectedPokemon.stats[3].base_stat}
                </span>
                <span>
                  <p>Special-Defense</p> {selectedPokemon.stats[4].base_stat}
                </span>
                <span>
                  <p>Speed</p> {selectedPokemon.stats[5].base_stat}
                </span>
              </div>
            </div>

            <div className="types">
              <h2>Types</h2>
              <p>
                {selectedPokemon.types.map((e, index) => (
                  <span key={index}>{e.type.name}</span>
                ))}
              </p>
            </div>

            <div className="weight">
              <h2>Weight</h2>
              <p>{selectedPokemon.weight} Ibs</p>
            </div>

            <div className="moves">
              <h2>Moves</h2>
              <div className="move">
                {selectedPokemon.moves.map((e, index) => (
                  <span key={index}>{e.move.name}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
