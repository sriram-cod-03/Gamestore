import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/search.css"; // Ensure you create or update this file

const SearchResults = () => {
  const { query } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="search-loading-container">
        <p className="text-white">Loading Arena Data...</p>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <h3 className="search-title">
        Search results for <span className="text-warning">"{query}"</span>
      </h3>

      {games.length === 0 && (
        <p className="text-white no-results">No games found inside the database archive.</p>
      )}

      {/* ✅ FLEX RESILIENT WRAPPER */}
      <div className="search-results-grid">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="search-game-card"
            onClick={() => navigate(`/game/${game.id}`)}
          >
            {/* Background Image Layer */}
            <div 
              className="search-game-bg" 
              style={{ 
                backgroundImage: `url(${game.background_image || "https://via.placeholder.com/400x220?text=No+Image"})` 
              }} 
            />
            
            {/* Dark Gaming Overlay */}
            <div className="search-game-overlay">
              <h5 className="search-card-title">{game.name}</h5>
              
              <div className="search-game-info-row">
                <p>🔥 Rating: {game.rating || "N/A"}</p>
                <p>🗓️ {game.released?.split("-")[0] || "Unknown"}</p>
              </div>

              <p className="search-platforms-text">
                🎮 {game.platforms
                  ? game.platforms
                      .map((p) => p.platform.name)
                      .slice(0, 3)
                      .join(", ")
                  : "N/A"}
              </p>
              
              <button className="search-card-btn">Show More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;