import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SearchResults = () => {
  const { query } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.rawg.io/api/games?search=${query}&key=10339595c43349fe932bbf361059223a`
        );
        const data = await response.json();
        setGames(data.results || []);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [query]);

  return (
    <div className="container mt-4">
      <h3 className="text-white mb-4">
        Search results for{" "}
        <span className="text-warning">"{query}"</span>
      </h3>

      {loading && <p className="text-white">Loading...</p>}
      {!loading && games.length === 0 && (
        <p className="text-white">No games found.</p>
      )}

      {/* ✅ VERTICAL LIST */}
      <div className="d-flex flex-column gap-3">
        {games.map((game) => (
          <div
            key={game.id}
            className="card bg-dark text-white border-secondary"
          >
            {/* ✅ HORIZONTAL CARD */}
            <div className="row g-0 align-items-center">
              {/* IMAGE */}
              <div className="col-md-4">
                <img
                  src={
                    game.background_image ||
                    "https://via.placeholder.com/400x220?text=No+Image"
                  }
                  className="img-fluid rounded-start"
                  style={{ height: "180px", objectFit: "cover", width: "100%" }}
                  alt={game.name}
                />
              </div>

              {/* CONTENT */}
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{game.name}</h5>

                  <p className="mb-1">⭐ Rating: {game.rating || "N/A"}</p>
                  <p className="mb-1">
                    📅 Released: {game.released || "Unknown"}
                  </p>
                  <p className="mb-2">
                    🎮 Platforms:{" "}
                    {game.platforms
                      ? game.platforms
                          .map((p) => p.platform.name)
                          .slice(0, 5)
                          .join(", ")
                      : "N/A"}
                  </p>

                  <Link
                    to={`/game/${game.id}`}
                    className="btn btn-outline-light btn-sm"
                  >
                    Show More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
