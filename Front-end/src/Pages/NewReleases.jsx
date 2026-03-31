import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/browse.css"; // Reusing your grid styles

const NewReleases = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  /* Platform IDs from RAWG API:
     PC: 4 | PlayStation 5: 187 | Xbox Series X/S: 186 
  */
  const [platform, setPlatform] = useState(""); // Empty means "All Platforms"

  useEffect(() => {
    const fetchNewGames = async () => {
      try {
        setLoading(true);
        const apiKey = "10339595c43349fe932bbf361059223a";
        
        // Add &platforms= parameter if a platform is selected
        const platformQuery = platform ? `&platforms=${platform}` : "";
        
        const res = await axios.get(
          `https://api.rawg.io/api/games?key=${apiKey}&ordering=-released&page_size=12${platformQuery}`
        );
        setGames(res.data.results);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewGames();
  }, [platform]); // Refetch when platform changes!

  return (
    <div className="container" style={{paddingTop: '40px'}}>
      <div className="new-releases-header">
        <h2 className="section-title">New Releases</h2>
        
        {/* PLATFORM FILTER BAR */}
        <div className="platform-filters">
          <button 
            className={platform === "" ? "filter-btn active" : "filter-btn"} 
            onClick={() => setPlatform("")}
          >All</button>
          <button 
            className={platform === "4" ? "filter-btn active" : "filter-btn"} 
            onClick={() => setPlatform("4")}
          >PC</button>
          <button 
            className={platform === "187" ? "filter-btn active" : "filter-btn"} 
            onClick={() => setPlatform("187")}
          >PlayStation</button>
          <button 
            className={platform === "186" ? "filter-btn active" : "filter-btn"} 
            onClick={() => setPlatform("186")}
          >Xbox</button>
        </div>
      </div>

      {loading ? (
        <div className="not-found-container"><h4 className="not-found-text">LOADING ARENA...</h4></div>
      ) : (
        <div className="browse-grid">
          {games.map(game => (
            <div className="browse-card" key={game.id}>
              <div className="card-img" style={{backgroundImage: `url(${game.background_image})`}}></div>
              <div className="card-info">
                <h4>{game.name}</h4>
                <p style={{color: '#aaa', fontSize: '14px'}}>Released: {game.released}</p>
                <div className="card-meta">
                   <span>⭐ {game.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewReleases;