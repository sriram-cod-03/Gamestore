import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requireAuthAndNavigate } from "../utils/auth";
import "../styles/freeGames.css";

// 🔥 MODULE LEVEL CACHE
let freeGameCache = null;

const ITEMS_PER_PAGE = 4;

const FreeGameCard = () => {
  const [games, setGames] = useState(freeGameCache || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!freeGameCache);

  const navigate = useNavigate();

  const freeGameNames = [
    "Fortnite Battle Royale",
    "Rocket League",
    "Genshin Impact",
    "PlayerUnknown’s Battlegrounds",
    "Valorant",
    "Marvel Rivals",
    "The Sims 4",
    "Asphalt 8: Airborne",
  ];

  useEffect(() => {
    if (freeGameCache) return;

    const fetchFreeGames = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";

        // ⚡ Parallel fetch (faster)
        const requests = freeGameNames.map((name) =>
          fetch(
            `https://api.rawg.io/api/games?search=${encodeURIComponent(
              name
            )}&key=${apiKey}`
          ).then((res) => res.json())
        );

        const responses = await Promise.all(requests);

        const finalGames = responses
          .map((r) => r.results?.[0])
          .filter(Boolean);

        freeGameCache = finalGames;
        setGames(finalGames);
      } catch (err) {
        console.error("Free games fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeGames();
  }, []);

  const handleShowMore = (id) => {
    requireAuthAndNavigate(navigate, `/game/${id}`);
  };

  const handleNext = () => {
    if (currentIndex + ITEMS_PER_PAGE < games.length) {
      setCurrentIndex((prev) => prev + ITEMS_PER_PAGE);
    }
  };

  const handlePrev = () => {
    if (currentIndex - ITEMS_PER_PAGE >= 0) {
      setCurrentIndex((prev) => prev - ITEMS_PER_PAGE);
    }
  };

  // ✅ MAIN FIX: hide everything while loading
  if (loading) {
    return null;
  }

  // Safety check
  if (games.length === 0) {
    return null;
  }

  return (
    <div className="free-container">
      {/* ✅ TITLE SHOWN ONLY AFTER LOAD */}
      <div className="free-header">
        <h4>Free-to-Play Games</h4>

        <div className="nav-buttons">
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            ⬅
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex + ITEMS_PER_PAGE >= games.length}
          >
            ➡
          </button>
        </div>
      </div>

      {/* ✅ GAME CARDS */}
      <div className="free-grid">
        {games
          .slice(currentIndex, currentIndex + ITEMS_PER_PAGE)
          .map((game) => (
            <div className="game-card" key={game.id}>
              <div
                className="game-bg"
                style={{
                  backgroundImage: `url(${game.background_image})`,
                }}
              />

              {/* FREE BADGE */}
              <span className="free-badge">FREE</span>

              <div className="game-overlay">
                <h5>{game.name}</h5>
                <p>⭐ {game.rating || "N/A"}</p>
                <p>📅 {game.released || "Unknown"}</p>
                <p className="genres">
                  🎮 {game.genres?.map((g) => g.name).slice(0, 2).join(", ")}
                </p>

                <button onClick={() => handleShowMore(game.id)}>
                  Play Now
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FreeGameCard;
