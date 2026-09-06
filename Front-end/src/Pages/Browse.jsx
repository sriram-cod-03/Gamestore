import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/browse.css";
import { FaStar, FaFilter, FaSortAmountDown, FaGamepad } from "react-icons/fa";

const BrowsePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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
  }, [genre, platform, sortBy]);

  return (
    <div className="browse-page-wrapper">
      <div className="browse-container">
        
        {/* MOBILE CONTROLS BAR (<= 850px) */}
        <div className="browse-mobile-bar">
          <button 
            className="mobile-filter-toggle"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <FaFilter /> {showMobileFilters ? "Hide Filters" : "Filters"}
          </button>

          <div className="mobile-sort-box">
            <FaSortAmountDown className="sort-icon-mobile" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="-added">Popularity</option>
              <option value="-rating">Top Rated</option>
              <option value="-released">Release Date</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="browse-layout">
          {/* SIDEBAR - FILTERS */}
          <aside className={`browse-sidebar ${showMobileFilters ? "show-mobile" : ""}`}>
            <div className="sidebar-section">
              <h3><FaFilter /> Genres</h3>
              <ul>
                <li 
                  className={genre === "" ? "active" : ""} 
                  onClick={() => { setGenre(""); setShowMobileFilters(false); }}
                >
                  All Genres
                </li>
                <li 
                  className={genre === "action" ? "active" : ""} 
                  onClick={() => { setGenre("action"); setShowMobileFilters(false); }}
                >
                  Action
                </li>
                <li 
                  className={genre === "role-playing-games-rpg" ? "active" : ""} 
                  onClick={() => { setGenre("role-playing-games-rpg"); setShowMobileFilters(false); }}
                >
                  RPG
                </li>
                <li 
                  className={genre === "shooter" ? "active" : ""} 
                  onClick={() => { setGenre("shooter"); setShowMobileFilters(false); }}
                >
                  Shooting
                </li>
                <li 
                  className={genre === "adventure" ? "active" : ""} 
                  onClick={() => { setGenre("adventure"); setShowMobileFilters(false); }}
                >
                  Adventure
                </li>
              </ul>
            </div>

            <div className="sidebar-section">
              <h3><FaGamepad /> Platforms</h3>
              <ul>
                <li 
                  className={platform === "" ? "active" : ""} 
                  onClick={() => { setPlatform(""); setShowMobileFilters(false); }}
                >
                  All Platforms
                </li>
                <li 
                  className={platform === "4" ? "active" : ""} 
                  onClick={() => { setPlatform("4"); setShowMobileFilters(false); }}
                >
                  PC
                </li>
                <li 
                  className={platform === "187" ? "active" : ""} 
                  onClick={() => { setPlatform("187"); setShowMobileFilters(false); }}
                >
                  PlayStation 5
                </li>
                <li 
                  className={platform === "186" ? "active" : ""} 
                  onClick={() => { setPlatform("186"); setShowMobileFilters(false); }}
                >
                  Xbox Series S/X
                </li>
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
            ) : games.length === 0 ? (
              <div className="browse-empty">No games found for the selected filter.</div>
            ) : (
              <div className="browse-grid">
                {games.map((game, index) => (
                  <div className="browse-card" key={game.id} onClick={() => navigate(`/game/${game.id}`)}>
                    <div className="card-media-wrapper">
                      <img 
                        src={game.background_image || "https://placehold.co/400x300/111/fff?text=GameStore"} 
                        alt={game.name}
                        className="browse-img"
                        width="300"
                        height="180"
                        loading={index < 4 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </div>
                    <div className="card-info">
                      <h4>{game.name}</h4>
                      <div className="card-meta">
                        <span className="rating"><FaStar className="star-icon" /> {game.rating || "4.5"}</span>
                        <span className="date">{game.released?.split("-")[0] || "2024"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;