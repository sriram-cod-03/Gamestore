import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/all-trending.css"; 

const AllTrending = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";
        // Fetching games released in the last year with high ratings
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&dates=2025-01-01,2026-12-31&ordering=-rating&page_size=12`
        );
        const data = await response.json();
        setGames(data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return <div className="trending-loader">SCANNING TRENDS...</div>;

  return (
    <div className="all-trending-page">
      <div className="container">
        <header className="trending-page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <h1 className="neon-trending-title">Trending Global Archive</h1>
        </header>

        <div className="trending-full-grid">
          {games.map((game) => (
            <div className="trending-full-card" key={game.id} onClick={() => navigate(`/game/${game.id}`)}>
              <div className="card-media">
                <img src={game.background_image} alt={game.name} />
                <div className="trending-rank-badge">TRENDING</div>
              </div>
              <div className="card-info">
                <h3>{game.name}</h3>
                <div className="card-stats">
                  <span>🔥 {game.rating}</span>
                  <span>🎮 {game.genres?.[0]?.name}</span>
                </div>
                <button className="intel-btn">View Intel</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTrending;