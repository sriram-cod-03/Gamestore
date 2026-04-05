import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/all-horror.css";

const AllHorror = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHorrorGames = async () => {
      setLoading(true);
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";
        
        // Attempt 1: Fetch by Genre Slug 'horror'
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&genres=horror&ordering=-rating&page_size=20`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          setGames(data.results);
        } else {
          // ✅ FALLBACK: If genre filter is empty, search for 'horror' keyword
          const fallbackRes = await fetch(
            `https://api.rawg.io/api/games?key=${apiKey}&search=horror&page_size=20`
          );
          const fallbackData = await fallbackRes.json();
          setGames(fallbackData.results || []);
        }
      } catch (err) {
        console.error("Horror fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHorrorGames();
  }, []);

  if (loading) {
    return <div className="horror-loader">WAKING THE HORRORS...</div>;
  }

  return (
    <div className="horror-page-wrapper">
      <div className="container">
        {/* HEADER AREA */}
        <header className="horror-page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> BACK
          </button>
          <h1 className="horror-page-title">Horror Collection</h1>
        </header>

        {/* GAMES GRID */}
        <div className="horror-full-grid">
          {games.length > 0 ? (
            games.map((game) => (
              <div 
                className="horror-page-card" 
                key={game.id} 
                onClick={() => navigate(`/game/${game.id}`)}
              >
                <div className="horror-card-media">
                  <img 
                    src={game.background_image || "https://via.placeholder.com/400x250?text=No+Image"} 
                    alt={game.name} 
                  />
                  <div className="horror-card-badge">SCARY</div>
                </div>
                
                <div className="horror-card-info">
                  <h3>{game.name}</h3>
                  <div className="horror-card-meta">
                    <span>⭐ {game.rating || "4.2"}</span>
                    <span>🗓️ {game.released?.split('-')[0] || "2024"}</span>
                  </div>
                  <button className="view-horror-btn">View Intel</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-horror-msg">
              <p>The spirits are still hiding. Try checking your API key or internet connection!</p>
              <button onClick={() => window.location.reload()} className="back-btn">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllHorror;