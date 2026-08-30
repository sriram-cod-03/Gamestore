import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/all-free.css";

const AllFree = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFreeGames = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";
        // Fetching games with the 'free-to-play' tag
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&tags=free-to-play&ordering=-added&page_size=12`,
        );
        const data = await response.json();
        setGames(data.results);
      } catch (err) {
        console.error("Free games fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFreeGames();
  }, []);

  if (loading)
    return <div className="free-loader">UNBLOCKING FREE CONTENT...</div>;

  return (
    <div className="all-free-page">
      <div className="container">
        <header className="free-page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <h1 className="cyan-free-title">Zero-Cost Archive</h1>
        </header>

        <div className="free-scroll-wrapper" ref={scrollRef}>
          {games.map((game, index) => (
            <div
              className="free-card"
              key={game.id}
              onClick={() => navigate(`/game/${game.id}`)}
            >
              {/* Replaced div background with optimized responsive <img> */}
              <img
                src={game.background_image}
                alt={game.name}
                className="free-bg"
                width="300"
                height="400"
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
              />

              <div className="free-overlay">
                <h5 className="card-title">{game.name}</h5>
                <div className="game-info-row">
                  <p>FREE</p>
                  <p>⭐ {game.rating || "4.2"}</p>
                </div>
                <button className="card-btn">Claim Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllFree;
