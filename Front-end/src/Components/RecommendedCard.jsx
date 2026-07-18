import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/recommended.css";

let recommendedCache = null;

const RecommendedCard = () => {
  const [games, setGames] = useState(recommendedCache || []);
  const [loading, setLoading] = useState(!recommendedCache);
  const navigate = useNavigate();

  // ✅ 1. Reference for the scrollable container
  const scrollRef = useRef(null);

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
            `https://api.rawg.io/api/games?search=${encodeURIComponent(name)}&key=${apiKey}`,
          ).then((res) => res.json()),
        );
        const responses = await Promise.all(requests);
        const finalGames = responses.map((r) => r.results?.[0]).filter(Boolean);
        recommendedCache = finalGames;
        setGames(finalGames);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGames();
  }, []);

  // ✅ 2. Scroll Logic
  // ... inside RecommendedCard component
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;

      // Check if the card exists in DOM; fallback immediately if reading layout triggers layout thrashing
      const card =
        current.querySelector(".game-card") ||
        current.querySelector(".trending-card") ||
        current.querySelector(".free-card");

      // Direct configuration fallback avoids repetitive layout calculations during button spams
      const scrollAmount = card ? card.getBoundingClientRect().width + 25 : 325;

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // ... (Rest of the component remains same)

  if (loading) return null;

  return (
    <div className="recommended-container">
      <div className="recommended-header">
        <h4
          className="clickable-title"
          onClick={() => navigate("/all-recommended")}
        >
          Recommended Games
        </h4>

        <div className="nav-buttons">
          {/* ✅ 3. Update buttons to trigger scroll function */}
          <button onClick={() => scroll("left")}>
            <FaChevronLeft />
          </button>
          <button onClick={() => scroll("right")}>
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* ✅ 4. Map ALL games and attach the ref */}
      <div className="recommended-scroll-wrapper" ref={scrollRef}>
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

export default RecommendedCard;
