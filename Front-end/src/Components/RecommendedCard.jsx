import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/recommended.css"; // Double check this path!

let recommendedCache = null;
const ITEMS_PER_PAGE = 4;

const RecommendedCard = () => {
  const [games, setGames] = useState(recommendedCache || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!recommendedCache);
  const [error, setError] = useState(null);
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
        setLoading(true);
        const apiKey = "10339595c43349fe932bbf361059223a";
        
        const requests = recommendedNames.map((name) =>
          fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(name)}&key=${apiKey}`)
            .then((res) => {
              if (!res.ok) throw new Error("API Limit Reached");
              return res.json();
            })
        );

        const responses = await Promise.all(requests);
        const finalGames = responses.map((r) => r.results?.[0]).filter(Boolean);

        if (finalGames.length === 0) {
          setError("No games found. Check your API Key.");
        } else {
          recommendedCache = finalGames;
          setGames(finalGames);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setError("Failed to load games. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleNext = () => {
    if (currentIndex + ITEMS_PER_PAGE < games.length) setCurrentIndex((prev) => prev + ITEMS_PER_PAGE);
  };

  const handlePrev = () => {
    if (currentIndex - ITEMS_PER_PAGE >= 0) setCurrentIndex((prev) => prev - ITEMS_PER_PAGE);
  };

  // --- DEBUGGING UI ---
  if (loading) return <div style={{color: 'white', padding: '20px'}}>Entering the Arena... Loading Games...</div>;
  if (error) return <div style={{color: 'red', padding: '20px'}}>{error}</div>;
  if (games.length === 0) return <div style={{color: 'orange', padding: '20px'}}>No games available.</div>;

  return (
    <div className="recommended-container">
      <div className="recommended-header">
        <h4 style={{fontWeight: '900', textTransform: 'uppercase'}}>Recommended Games</h4>
        <div className="nav-buttons">
          <button onClick={handlePrev} disabled={currentIndex === 0}><FaChevronLeft /></button>
          <button onClick={handleNext} disabled={currentIndex + ITEMS_PER_PAGE >= games.length}><FaChevronRight /></button>
        </div>
      </div>

      <div className="recommended-grid">
        {games.slice(currentIndex, currentIndex + ITEMS_PER_PAGE).map((game) => (
          /* THE GAME CARD: Activates the Snake Border */
          <div className="game-card" key={game.id} onClick={() => navigate(`/game/${game.id}`)}>
            
            {/* Background */}
            <div className="game-bg" style={{ backgroundImage: `url(${game.background_image})` }} />
            
            {/* Snake Border Content Mask */}
            <div className="game-overlay">
              <h5 className="card-title" style={{fontWeight: '800'}}>{game.name}</h5>
              
              <div className="game-info">
                <p>🔥 Rating: {game.rating || "4.5"}</p>
              </div>
              
              <div className="game-info">
                {/* Year Split Fix */}
                <p>🗓️ {game.released ? game.released.split("-")[0] : "2026"}</p>
              </div>

              <div className="game-info">
                <p>🎮 {game.genres?.map((g) => g.name).slice(0, 1) || "Action"}</p>
              </div>

              <button className="card-btn" style={{backgroundColor: '#fff', color: '#000', fontWeight: '900'}}>
                Show More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCard;