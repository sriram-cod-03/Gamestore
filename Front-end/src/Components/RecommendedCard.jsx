import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/recommended.css"; 

let recommendedCache = null;
const ITEMS_PER_PAGE = 4;

const RecommendedCard = () => {
  const [games, setGames] = useState(recommendedCache || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!recommendedCache);
  const navigate = useNavigate();

  const recommendedNames = [
    "The Witcher 3", "Call of Duty WWII", "Red Dead Redemption 2",
    "Assassin’s Creed IV Black Flag", "Cyberpunk 2077", "GTA V",
    "Elden Ring", "Hogwarts Legacy",
  ];

  useEffect(() => {
    if (recommendedCache) return;
    const fetchGames = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";
        const requests = recommendedNames.map((name) =>
          fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(name)}&key=${apiKey}`).then((res) => res.json())
        );
        const responses = await Promise.all(requests);
        const finalGames = responses.map((r) => r.results?.[0]).filter(Boolean);
        recommendedCache = finalGames;
        setGames(finalGames);
        setLoading(false);
      } catch (err) { console.error(err); }
    };
    fetchGames();
  }, []);

  const handleNext = () => {
    if (currentIndex + ITEMS_PER_PAGE < games.length) setCurrentIndex((prev) => prev + ITEMS_PER_PAGE);
  };
  const handlePrev = () => {
    if (currentIndex - ITEMS_PER_PAGE >= 0) setCurrentIndex((prev) => prev - ITEMS_PER_PAGE);
  };

  if (loading) return null;

  return (
    <div className="recommended-container">
      {/* --- HEADER: CLEAN WHITE & CLICKABLE --- */}
      <div className="recommended-header">
        <h4 
          className="clickable-title" 
          onClick={() => navigate('/all-recommended')}
        >
          Recommended Games
        </h4>
        
        <div className="nav-buttons">
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            <FaChevronLeft />
          </button>
          <button onClick={handleNext} disabled={currentIndex + ITEMS_PER_PAGE >= games.length}>
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="recommended-grid">
        {games.slice(currentIndex, currentIndex + ITEMS_PER_PAGE).map((game) => (
          <div className="game-card" key={game.id} onClick={() => navigate(`/game/${game.id}`)}>
            <div className="game-bg" style={{ backgroundImage: `url(${game.background_image})` }} />
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