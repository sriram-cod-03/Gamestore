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

  // ✅ 2. Scroll Logic
 // ... inside RecommendedCard component

const scroll = (direction) => {
  if (scrollRef.current) {
    const { current } = scrollRef;
    // ✅ 1. Get the width of one card (including the gap)
    const card = current.querySelector(".game-card");
    if (!card) return;
    const cardWidth = card.clientWidth + 25; // Card width + 25px gap
    if (direction === "left") {
      // ✅ 2. Scroll by exactly one card width
      current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    } else {
      current.scrollBy({ left: cardWidth, behavior: "smooth" });
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
          onClick={() => navigate('/all-recommended')}
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