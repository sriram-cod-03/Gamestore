import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requireAuthAndNavigate } from "../utils/auth";
import "../styles/horror.css";

let horrorCache = null;

const HorrorCard = () => {
  const [games, setGames] = useState(horrorCache || []);
  const [loading, setLoading] = useState(!horrorCache);

  const navigate = useNavigate();

  const horrorGameNames = [
    "Resident Evil Village",
    "Resident Evil 2002",
    "Song of Horror",
    "The Backrooms 1998",
  ];

  useEffect(() => {
    if (horrorCache) return;

    const fetchHorrorGames = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";

        // ⚡ Parallel fetch (FAST)
        const requests = horrorGameNames.map((name) =>
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

        horrorCache = finalGames;
        setGames(finalGames);
      } catch (err) {
        console.error("Horror games fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHorrorGames();
  }, []);

  const handleShowMore = (id) => {
    requireAuthAndNavigate(navigate, `/game/${id}`);
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
    <div className="horror-container">
      {/* ✅ TITLE SHOWN ONLY AFTER LOAD */}
      <h4 className="horror-title">Horror Games</h4>

      <div className="horror-grid">
        {games.map((game) => (
          <div className="game-card horror-card" key={game.id}>
            <div
              className="game-bg"
              style={{
                backgroundImage: `url(${game.background_image})`,
              }}
            />

            {/* HORROR BADGE */}
            <span className="horror-badge">HORROR</span>

            <div className="game-overlay">
              <h5>{game.name}</h5>
              <p>⭐ {game.rating || "N/A"}</p>
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

export default HorrorCard;
