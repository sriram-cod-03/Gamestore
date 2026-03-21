import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requireAuthAndNavigate } from "../utils/auth";
import "../styles/freeGames.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// 🔥 MODULE LEVEL CACHE to prevent re-fetching on every render
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

        const requests = freeGameNames.map((name) =>
          fetch(
            `https://api.rawg.io/api/games?search=${encodeURIComponent(
              name
            )}&key=${apiKey}`
          ).then((res) => res.json())
        );

        const responses = await Promise.all(requests);
        const finalGames = responses.map((r) => r.results?.[0]).filter(Boolean);

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

  // ✅ Hide everything while loading
  if (loading || games.length === 0) {
    return null;
  }

  return (
    <div className="free-container">
      {/* HEADER SECTION */}
      <div className="free-header">
        <h4>Free-to-Play Games</h4>

        <div className="nav-buttons">
          {/* ✅ FIXED: Changed startIndex to currentIndex */}
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            <FaChevronLeft />
          </button>
          
          {/* ✅ FIXED: Changed startIndex to currentIndex and totalGames to games.length */}
          <button 
            onClick={handleNext} 
            disabled={currentIndex + ITEMS_PER_PAGE >= games.length}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* GAME GRID */}
      <div className="free-grid">
        {games
          .slice(currentIndex, currentIndex + ITEMS_PER_PAGE)
          .map((game) => (
            <div className="free-card" key={game.id}>
              <div
                className="free-bg"
                style={{
                  backgroundImage: `url(${game.background_image})`,
                }}
              />

              {/* FREE BADGE */}
              <span className="free-badge">FREE</span>

              <div className="free-overlay">
                <h5>{game.name}</h5>
                <p>⭐ {game.rating || "N/A"}</p>
                <p>📅 {game.released || "Unknown"}</p>
                <p className="genres">
                  🎮{" "}
                  {game.genres
                    ?.map((g) => g.name)
                    .slice(0, 2)
                    .join(", ")}
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