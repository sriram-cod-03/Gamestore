import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requireAuthAndNavigate } from "../utils/auth";
import "../styles/trending.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// MODULE LEVEL CACHE
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

        const requests = trendingNames.map((name) =>
          fetch(
            `https://api.rawg.io/api/games?search=${encodeURIComponent(
              name,
            )}&key=${apiKey}`,
          ).then((res) => res.json()),
        );

        const responses = await Promise.all(requests);
        const finalGames = responses.map((r) => r.results?.[0]).filter(Boolean);

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

  if (loading || games.length === 0) {
    return null;
  }

  return (
    <div className="trending-container">
      <div className="trending-header">
        <h4>Trending Games</h4>

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

      <div className="trending-grid">
        {games
          .slice(currentIndex, currentIndex + ITEMS_PER_PAGE)
          .map((game) => (
            /* ✅ FIXED: Using trending-card classes to match your CSS */
            <div className="trending-card" key={game.id}>
              <div
                className="trending-bg"
                style={{
                  backgroundImage: `url(${game.background_image})`,
                }}
              />
              
              {/* Optional: Add the badge since it's in your CSS */}
              <div className="trending-badge">Trending</div>

              <div className="trending-overlay">
                <h5>{game.name}</h5>
                <div className="trending-info">
                   <span>🔥 Rating: {game.rating || "N/A"}</span>
                   <span>📅 {game.released?.split('-')[0] || "Unknown"}</span>
                </div>
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

export default TrendingGameCard;