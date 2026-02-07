import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/gameDetails.css";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);

        const [gameRes, screenRes] = await Promise.all([
          fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`),
          fetch(
            `https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`
          ),
        ]);

        const gameData = await gameRes.json();
        const screenData = await screenRes.json();

        setGame(gameData);
        setScreenshots(screenData.results || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load game details");
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) {
    return <div className="details-loader">Loading game details...</div>;
  }

  if (error) {
    return <div className="details-error">{error}</div>;
  }

  if (!game) {
    return <div className="details-error">Game not found</div>;
  }

  return (
    <div className="game-details-page">
      {/* 🔥 HERO BANNER */}
      <div
        className="game-hero"
        style={{
          backgroundImage: `url(${game.background_image})`,
        }}
      >
        <div className="hero-overlay">
          <h1>{game.name}</h1>
          <p>{game.genres?.map((g) => g.name).join(" • ")}</p>
        </div>
      </div>

      {/* 🔍 INFO CARD */}
      <div className="game-info-card">
        <div className="info-grid">
          <div>
            ⭐ <strong>Rating:</strong> {game.rating || "N/A"} / 5
          </div>
          <div>
            📅 <strong>Released:</strong> {game.released || "Unknown"}
          </div>
          <div>
            ⏳ <strong>Playtime:</strong> {game.playtime} hrs
          </div>
          <div>
            🎮 <strong>Platforms:</strong>{" "}
            {game.platforms?.map((p) => p.platform.name).join(", ")}
          </div>
        </div>

        <div className="description">
          <h3>Description</h3>
          <p>{game.description_raw || "No description available"}</p>
        </div>
      </div>

      {/* 📸 SCREENSHOTS */}
      {screenshots.length > 0 && (
        <div className="screenshots-section">
          <h3>Screenshots</h3>
          <div className="screenshots-grid">
            {screenshots.map((shot) => (
              <img
                key={shot.id}
                src={shot.image}
                alt="screenshot"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}

      {/* 💰 BUY BUTTON */}
      <div className="buy-section">
        <button onClick={() => navigate(`/payment/${id}`)}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default GameDetails;
