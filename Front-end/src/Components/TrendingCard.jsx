import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// Ensure this path matches your file structure
import "../styles/trending.css";

// MODULE LEVEL CACHE - Prevents re-fetching data when navigating back and forth
let trendingCache = null;
const ITEMS_PER_PAGE = 4;

const TrendingGameCard = () => {
  const [games, setGames] = useState(trendingCache || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!trendingCache);
  const navigate = useNavigate();

  // The list of games to display in the Trending section
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
    // If we have cached data, don't hit the API again
    if (trendingCache) return;

    const fetchTrendingGames = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";

        // Fetch all games in parallel for speed
        const requests = trendingNames.map((name) =>
          fetch(
            `https://api.rawg.io/api/games?search=${encodeURIComponent(name)}&key=${apiKey}`,
          ).then((res) => res.json()),
        );

        const responses = await Promise.all(requests);
        // Extract the best match for each name
        const finalGames = responses.map((r) => r.results?.[0]).filter(Boolean);

        trendingCache = finalGames;
        setGames(finalGames);
      } catch (err) {
        console.error("Trending games fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGames();
  }, []);

  // Pagination Handlers
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

  const handleShowMore = (id) => {
    navigate(`/game/${id}`);
  };

  if (loading || games.length === 0) return null;

  return (
    <div className="trending-container">
      {/* SECTION HEADER */}
      <div className="trending-header">
        {/* ✅ CLICKABLE TITLE ADDED */}
        <h4
          className="clickable-trending-title"
          onClick={() => navigate("/all-trending")}
        >
          Trending Games
        </h4>
        <div className="nav-buttons">
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex + ITEMS_PER_PAGE >= games.length}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* GAMES GRID */}
      <div className="trending-grid">
        {games
          .slice(currentIndex, currentIndex + ITEMS_PER_PAGE)
          .map((game) => (
            /* THE CARD: Triggers the Violet/Pink Snake Border in CSS */
            <div className="trending-card" key={game.id}>
              {/* Background Image Layer */}
              <div
                className="trending-bg"
                style={{
                  backgroundImage: `url(${game.background_image})`,
                }}
              />

              <div className="trending-badge">Trending</div>

              {/* CONTENT OVERLAY */}
              <div className="trending-overlay">
                <h5>{game.name}</h5>

                {/* ✅ ALIGNMENT FIX: Structured Row for Rating and Year */}
                <div className="trending-info">
                  <span>🔥 Rating: {game.rating || "4.3"}</span>
                  <span>🗓️ {game.released?.split("-")[0] || "2024"}</span>
                </div>

                {/* Genre Row */}
                <p className="genres">
                  <span>🎮</span>
                  {game.genres
                    ?.map((g) => g.name)
                    .slice(0, 2)
                    .join(", ")}
                </p>

                {/* ✅ NO INLINE STYLES: Allows CSS Pink Hover to work */}
                <button
                  className="trending-btn"
                  onClick={() => handleShowMore(game.id)}
                >
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
