import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SearchResults = () => {
  const { query } = useParams();
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?search=${query}&key=10339595c43349fe932bbf361059223a`
        );
        const data = await response.json();
        setGames(data.results || []);
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };
    fetchGames();
  }, [query]);

  return (
    <div className="container mt-4">
      <h3 className="text-white">Search for "{query}"</h3>
      <div className="row">
        {games.length === 0 ? (
          <p>No results found.</p>
        ) : (
          games.map((game) => (
            <div className="col-md-3 mb-3" key={game.id}>
              <div className="card h-70">
                <img
                  src={game.background_image}
                  className="card-img-top"
                  style={{ maxHeight: "170px" }}
                  alt={game.name}
                />
                <div
                  className="card-body text-white"
                  style={{ backgroundColor: "#222" }}
                >
                  <h5 className="card-title">{game.name}</h5>
                  <p className="card-text">⭐Rating: {game.rating}/5</p>
                  <p>📅 Released: {game.released}</p>
                  <p>⌛ Playtime: {game.playtime} hrs</p>
                  <p>
                    🎮 Platforms:{" "}
                    {game.platforms.map((p) => p.platform.name).join(", ")}
                  </p>

                  {/* Instead of handleShowMore → Link */}
                  <Link
                    to={`/game/${game.id}`}
                    className="btn btn-outline-light"
                  >
                    Show More
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;
