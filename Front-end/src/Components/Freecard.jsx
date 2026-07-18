import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { requireAuthAndNavigate } from "../utils/auth";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/freeGames.css";

// 🔥 MODULE LEVEL CACHE
let freeGameCache = null;

const FreeGameCard = () => {
  const [games, setGames] = useState(freeGameCache || []);
  const [loading, setLoading] = useState(!freeGameCache);
  const navigate = useNavigate();

  // ✅ 1. Reference for the scrollable container
  const scrollRef = useRef(null);

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
            `https://api.rawg.io/api/games?search=${encodeURIComponent(name)}&key=${apiKey}`,
          ).then((res) => res.json()),
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

  // ✅ 2. Roller Coaster (One-to-One Snap) Scroll Logic
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

  if (loading || games.length === 0) return null;

  return (
    <div className="free-container">
      {/* HEADER SECTION */}
      <div className="free-header">
        <h4
          className="clickable-free-title"
          onClick={() => navigate("/all-free")}
        >
          Free-to-Play Games
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

      {/* ✅ 4. Changed grid to scroll-wrapper and attached ref */}
      <div className="free-scroll-wrapper" ref={scrollRef}>
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

export default FreeGameCard;
