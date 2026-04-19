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
    "Fortnite Battle Royale", "Rocket League", "Genshin Impact",
    "PlayerUnknown’s Battlegrounds", "Valorant", "Marvel Rivals",
    "The Sims 4", "Asphalt 8: Airborne",
  ];

  useEffect(() => {
    if (freeGameCache) return;
    const fetchFreeGames = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";
        const requests = freeGameNames.map((name) =>
          fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(name)}&key=${apiKey}`).then((res) => res.json())
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
      const card = current.querySelector(".free-card");
      if (!card) return;

      // Card width + the gap (25px)
      const scrollAmount = card.clientWidth + 25;

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
        <h4 className="clickable-free-title" onClick={() => navigate("/all-free")}>
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
          <div className="free-card" key={game.id} onClick={() => navigate(`/game/${game.id}`)}>
            <div
              className="free-bg"
              style={{ backgroundImage: `url(${game.background_image})` }}
            />
            <span className="free-badge">FREE</span>
            <div className="free-overlay">
              <h5>{game.name}</h5>
              <div className="free-info-row">
                <span>⭐ {game.rating || "N/A"}</span>
                <span>🗓️ {game.released?.split("-")[0] || "2024"}</span>
              </div>
              <p className="genres">
                🎮 {game.genres?.map((g) => g.name).slice(0, 2).join(", ")}
              </p>
              <button onClick={(e) => { e.stopPropagation(); handleShowMore(game.id); }}>
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