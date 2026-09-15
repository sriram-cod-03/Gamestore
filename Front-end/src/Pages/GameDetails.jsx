import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaCalendarAlt, FaGamepad, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import "../styles/gameDetails.css";

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

  /* --- STYLED NEON LOADER --- */
  if (loading) {
    return (
      <div className="details-loader-screen">
        <div className="loader-box">
          <div className="cyber-spinner"></div>
          <p className="loader-text">INITIALIZING GAME INTEL...</p>
        </div>
      </div>
    );
  }

  /* --- STYLED GLASS ERROR BOX --- */
  if (error) {
    return (
      <div className="details-loader-screen">
        <div className="details-error-card">
          <FaExclamationTriangle className="error-icon" />
          <h2>CONNECTION ERROR</h2>
          <p>{error}</p>
          <button className="error-back-btn" onClick={() => navigate("/browse")}>
            Return to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-details-page">
      {/* HERO BANNER */}
      <div
        className="game-hero"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(10,10,10,0.95) 100%), url(${game.background_image})`,
        }}
      >
        <div className="hero-content">
          <button className="back-nav-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <h1 className="game-detail-title">{game.name}</h1>
          <div className="hero-genres">
            {game.genres?.map((g) => (
              <span key={g.id} className="genre-badge">{g.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="details-container">
        {/* INFO CARD */}
        <div className="game-info-card">
          <div className="info-grid">
            <div className="info-item">
              <FaStar className="icon star" />
              <span><strong>Rating:</strong> {game.rating || "N/A"} / 5</span>
            </div>
            <div className="info-item">
              <FaCalendarAlt className="icon cal" />
              <span><strong>Released:</strong> {game.released || "Unknown"}</span>
            </div>
            <div className="info-item">
              <FaGamepad className="icon pad" />
              <span><strong>Platforms:</strong> {game.platforms?.map((p) => p.platform.name).join(", ") || "PC"}</span>
            </div>
          </div>

          <div className="description">
            <h3>About {game.name}</h3>
            <p>{game.description_raw || "No description available for this title."}</p>
          </div>
        </div>

        {/* SCREENSHOTS */}
        {screenshots.length > 0 && (
          <div className="screenshots-section">
            <h3>Intel Gallery</h3>
            <div className="screenshots-grid">
              {screenshots.map((shot, index) => (
                <div key={shot.id} className="screenshot-item">
                  <img
                    src={shot.image}
                    alt={`${game.name} screenshot`}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    width="400"
                    height="225"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUY / ACTION */}
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