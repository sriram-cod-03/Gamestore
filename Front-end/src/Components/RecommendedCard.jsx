import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requireAuthAndNavigate } from "../utils/auth";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/recommended.css";

// MODULE LEVEL CACHE to prevent re-fetching when switching pages
let recommendedCache = null;

const ITEMS_PER_PAGE = 4;

const RecommendedGameCards = () => {
  const [games, setGames] = useState(recommendedCache || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!recommendedCache);

  const navigate = useNavigate();

  const recommendedNames = [
    "The Witcher 3",
    "Call of Duty WWII",
    "Red Dead Redemption 2",
    "Assassin’s Creed IV Black Flag",
    "Cyberpunk 2077",
    "GTA V",
    "Elden Ring",
    "Hogwarts Legacy",
  ];

  useEffect(() => {
    if (recommendedCache) return;

    const fetchGames = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";

        const requests = recommendedNames.map((name) =>
          fetch(
            `https://api.rawg.io/api/games?search=${encodeURIComponent(
              name
            )}&key=${apiKey}`
          ).then((res) => res.json())
        );

        const responses = await Promise.all(requests);
        const finalGames = responses.map((r) => r.results?.[0]).filter(Boolean);

        recommendedCache = finalGames;
        setGames(finalGames);
      } catch (err) {
        console.error("Recommended games fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
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

  // Hide everything while loading
  if (loading || games.length === 0) {
    return null; 
  }

  return (
    <div className="recommended-container">
      <div className="recommended-header">
        <h4>Recommended Games</h4>

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

      <div className="recommended-grid">
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

              <div className="game-overlay">
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
                  Show More
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecommendedGameCards;