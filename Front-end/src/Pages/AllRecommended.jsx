import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/all-recommended.css"; 

const AllRecommended = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fullList = [
    "The Witcher 3", "Call of Duty WWII", "Red Dead Redemption 2",
    "Assassin’s Creed IV Black Flag", "Cyberpunk 2077", "GTA V",
    "Elden Ring", "Hogwarts Legacy", "God of War", "Spider-Man",
    "Ghost of Tsushima", "Resident Evil Village"
  ];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";
        const requests = fullList.map(name =>
          fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(name)}&key=${apiKey}`).then(res => res.json())
        );
        const responses = await Promise.all(requests);
        setGames(responses.map(r => r.results?.[0]).filter(Boolean));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="loader-screen">SYNCING DATABASE...</div>;

  return (
    <div className="all-rec-page-wrapper">
      <div className="container">
        <header className="all-rec-header">
          <button className="back-home-btn" onClick={() => navigate('/')}>
            <FaArrowLeft /> Back
          </button>
          <h1 className="fire-title">The Recommended Vault</h1>
        </header>

        <div className="all-rec-full-grid">
          {games.map(game => (
            <div className="full-card" key={game.id} onClick={() => navigate(`/game/${game.id}`)}>
              <div className="full-card-img" style={{ backgroundImage: `url(${game.background_image})` }} />
              <div className="full-card-info">
                <h3>{game.name}</h3>
                <div className="meta-row">
                  <span>🔥 {game.rating}</span>
                  <span>🗓️ {game.released?.split('-')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllRecommended;