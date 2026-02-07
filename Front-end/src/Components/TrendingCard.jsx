import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requireAuthAndNavigate } from "../utils/auth";
import "../styles/trending.css";

// 🔥 MODULE LEVEL CACHE
let trendingCache = null;

const ITEMS_PER_PAGE = 4;

const TrendingGameCard = () => {
  const [games, setGames] = useState(trendingCache || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!trendingCache);

  const navigate = useNavigate();

  const trendingNames = [
    "Black Myth: Wukong",
    "Wuchang: Fallen Feathers",
    "Far Cry 6",
    "Detroit: Become Human",
    "Watch Dogs",
    "Battlefield 2042",
    "Titan Quest 2",
    "2010 FIFA World Cup",
  ];

  useEffect(() => {
    if (trendingCache) return;

    const fetchTrendingGames = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";

        // ⚡ parallel fetch (fast)
        const requests = trendingNames.map((name) =>
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

        trendingCache = finalGames;
        setGames(finalGames);
      } catch (err) {
        console.error("Trending games fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGames();
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

  if (games.length === 0) {
    return null;
  }

  return (
    <div className="trending-container">
      {/* ✅ TITLE SHOWN ONLY AFTER LOAD */}
      <div className="trending-header">
        <h4>Trending Games</h4>

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

      {/* ✅ CARDS */}
      <div className="trending-grid">
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
                <p>🔥 Rating: {game.rating || "N/A"}</p>
                <p>📅 {game.released || "Unknown"}</p>
                <p className="genres">
                  🎮 {game.genres?.map((g) => g.name).slice(0, 2).join(", ")}
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

export default TrendingGameCard;
