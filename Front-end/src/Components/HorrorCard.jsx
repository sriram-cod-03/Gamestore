import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Assuming you have this utility for authentication
import { requireAuthAndNavigate } from "../utils/auth";
import "../styles/horror.css";

// Cache to prevent multiple API calls
let horrorCache = null;

const HorrorCard = () => {
  const [games, setGames] = useState(horrorCache || []);
  const [loading, setLoading] = useState(!horrorCache);
  const navigate = useNavigate();

  const horrorGameNames = [
    "Resident Evil Village",
    "Resident Evil 2",
    "Song of Horror",
    "The Backrooms 1998",
  ];

  useEffect(() => {
    if (horrorCache) return;

    const fetchHorrorGames = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";

        const requests = horrorGameNames.map((name) =>
          fetch(
            `https://api.rawg.io/api/games?search=${encodeURIComponent(name)}&key=${apiKey}`,
          ).then((res) => res.json()),
        );

        const responses = await Promise.all(requests);
        const finalGames = responses.map((r) => r.results?.[0]).filter(Boolean);

        horrorCache = finalGames;
        setGames(finalGames);
      } catch (err) {
        console.error("Horror games fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHorrorGames();
  }, []);

  const handleShowMore = (id) => {
    if (requireAuthAndNavigate) {
      requireAuthAndNavigate(navigate, `/game/${id}`);
    } else {
      navigate(`/game/${id}`);
    }
  };

  if (loading || games.length === 0) {
    return null;
  }

  return (
    <div className="horror-container">
      {/* --- ✅ CLICKABLE WHITE TITLE --- */}
      <h4
        className="clickable-horror-title"
        onClick={() => navigate("/all-horror")}
      >
        Horror Games
      </h4>

      <div className="horror-grid">
        {games.map((game) => (
          <div
            className="game-card"
            key={game.id}
            onClick={() => navigate(`/game/${game.id}`)}
          >
            {/* ✅ PASTE THE OPTIMIZED IMG TAG HERE */}
            <img
              src={game.background_image}
              alt={game.name}
              className="game-bg" /* Keeps your existing CSS styling */
              loading="lazy" /* Boosts performance by loading images only when visible */
              decoding="async" /* Prevents main thread blocking during dynamic content load */
            />

            <div className="game-overlay">
              <h5 className="card-title">{game.name}</h5>
              <div className="game-info-row">
                <p>🔥 {game.rating || "4.5"}</p>
                <p>🗓️ {game.released?.split("-")[0]}</p>
              </div>
              <button className="card-btn">Show More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorrorCard;
