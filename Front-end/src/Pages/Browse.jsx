import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/browse.css";
import { FaStar, FaFilter, FaSortAmountDown } from "react-icons/fa";

const BrowsePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- FILTER & SORT STATE ---
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [sortBy, setSortBy] = useState("-added"); // Default: Popularity

  const apiKey = "10339595c43349fe932bbf361059223a";

  useEffect(() => {
    const fetchBrowsedGames = async () => {
      setLoading(true);
      try {
        // Construct the URL with filters
        let url = `https://api.rawg.io/api/games?key=${apiKey}&page_size=20&ordering=${sortBy}`;
        
        if (genre) url += `&genres=${genre}`;
        if (platform) url += `&platforms=${platform}`;

        const response = await fetch(url);
        const data = await response.json();
        setGames(data.results || []);
      } catch (error) {
        console.error("Browse Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrowsedGames();
  }, [genre, platform, sortBy]); // Runs whenever these change

  return (
    <div className="browse-layout">
      {/* SIDEBAR - FILTERS */}
      <aside className="browse-sidebar">
        <div className="sidebar-section">
          <h3><FaFilter /> Genres</h3>
          <ul>
            <li className={genre === "" ? "active" : ""} onClick={() => setGenre("")}>All Genres</li>
            <li className={genre === "action" ? "active" : ""} onClick={() => setGenre("action")}>Action</li>
            <li className={genre === "role-playing-games-rpg" ? "active" : ""} onClick={() => setGenre("role-playing-games-rpg")}>RPG</li>
            <li className={genre === "shooter" ? "active" : ""} onClick={() => setGenre("shooter")}>Shooting</li>
            <li className={genre === "adventure" ? "active" : ""} onClick={() => setGenre("adventure")}>Adventure</li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3><FaStar /> Platforms</h3>
          <ul>
            <li className={platform === "" ? "active" : ""} onClick={() => setPlatform("")}>All Platforms</li>
            <li className={platform === "4" ? "active" : ""} onClick={() => setPlatform("4")}>PC</li>
            <li className={platform === "187" ? "active" : ""} onClick={() => setPlatform("187")}>PlayStation 5</li>
            <li className={platform === "186" ? "active" : ""} onClick={() => setPlatform("186")}>Xbox Series S/X</li>
          </ul>
        </div>
      </aside>

      {/* MAIN CONTENT - GRID */}
      <main className="browse-main">
        <header className="browse-header">
          <h2>Browse Games</h2>
          <div className="sort-container">
            <span><FaSortAmountDown /> Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="-added">Popularity</option>
              <option value="-rating">Top Rated</option>
              <option value="-released">Release Date</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </header>

        {loading ? (
          <div className="browse-loader">Loading Catalog...</div>
        ) : (
          <div className="browse-grid">
            {games.map((game) => (
              <div className="browse-card" key={game.id} onClick={() => navigate(`/game/${game.id}`)}>
                <div className="card-img" style={{ backgroundImage: `url(${game.background_image})` }}></div>
                <div className="card-info">
                  <h4>{game.name}</h4>
                  <div className="card-meta">
                    <span className="rating">⭐ {game.rating}</span>
                    <span className="date">{game.released?.split("-")[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowsePage;