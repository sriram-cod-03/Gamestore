import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaStar, FaCalendarAlt, FaHourglassHalf, FaGamepad } from "react-icons/fa"; // Added icons for better UI
import "../styles/gameDetails.css";

// Using Vite's env variable
const API_KEY = import.meta.env.VITE_RAWG_API_KEY || "10339595c43349fe932bbf361059223a";

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
        // Scroll to top when opening a new game
        window.scrollTo(0, 0);

        const [gameRes, screenRes] = await Promise.all([
          fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`),
          fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`),
        ]);

        if (!gameRes.ok) throw new Error("Game not found");

        const gameData = await gameRes.json();
        const screenData = await screenRes.json();

        setGame(gameData);
        setScreenshots(screenData.results || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load game details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="details-loader-container">
        <div className="details-loader"></div>
        <p>Fetching Game Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-error-container">
        <h2>Oops!</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/browse")}>Back to Browse</button>
      </div>
    );
  }

  return (
    <div className="game-details-page">
      {/* 🔥 HERO BANNER */}
      <div
        className="game-hero"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), #0a0a0a), url(${game.background_image})`,
        }}
      >
        <div className="hero-content">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1>{game.name}</h1>
          <div className="hero-genres">
            {game.genres?.map((g) => (
              <span key={g.id} className="genre-badge">{g.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="details-container">
        {/* 🔍 INFO CARD */}
        <div className="game-info-card">
          <div className="info-grid">
            <div className="info-item">
              <FaStar className="icon star" />
              <span><strong>Rating:</strong> {game.rating || "N/A"} / 5</span>
            </div>
            <div className="info-item">
              <FaCalendarAlt className="icon" />
              <span><strong>Released:</strong> {game.released || "Unknown"}</span>
            </div>
            <div className="info-item">
              <FaHourglassHalf className="icon" />
              <span><strong>Playtime:</strong> {game.playtime || 0} hrs</span>
            </div>
            <div className="info-item">
              <FaGamepad className="icon" />
              <span><strong>Platforms:</strong> {game.platforms?.map((p) => p.platform.name).join(", ")}</span>
            </div>
          </div>

          <div className="description">
            <h3>About {game.name}</h3>
            {/* description_raw is safer than dangerouslySetInnerHTML for plain text */}
            <p>{game.description_raw || "No description available for this title."}</p>
          </div>
        </div>

        {/* 📸 SCREENSHOTS */}
        {screenshots.length > 0 && (
          <div className="screenshots-section">
            <h3>Gallery</h3>
            <div className="screenshots-grid">
              {screenshots.map((shot) => (
                <div key={shot.id} className="screenshot-item">
                  <img
                    src={shot.image}
                    alt={`${game.name} screenshot`}
                    /* Removing loading="lazy" to stop the Browser Intervention warning */
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 💰 BUY ACTION */}
        <div className="buy-section">
          <button className="buy-now-btn" onClick={() => navigate(`/payment/${id}`)}>
            Add to Library
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;