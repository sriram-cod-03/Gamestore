import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/gameCarousel.css";

// 🔥 CACHE
let carouselCache = null;

const AUTO_SLIDE_TIME = 5000;

const GameCarouselCard = () => {
  const [games, setGames] = useState(carouselCache || []);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(!carouselCache);

  const navigate = useNavigate();

  const gameNames = [
    "Grand Theft Auto V",
    "Red Dead Redemption 2",
    "Assassin's Creed Valhalla",
    "God of War III",
    "Saints Row: The Third",
    "Need for Speed Heat",
  ];

  useEffect(() => {
    if (carouselCache) return;

    const fetchGames = async () => {
      try {
        const apiKey = "10339595c43349fe932bbf361059223a";

        // ⚡ Parallel fetch (FAST)
        const requests = gameNames.map((name) =>
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

        carouselCache = finalGames;
        setGames(finalGames);
      } catch (err) {
        console.error("Carousel fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // 🔁 AUTO SLIDE
  useEffect(() => {
    if (!games.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % games.length);
    }, AUTO_SLIDE_TIME);

    return () => clearInterval(timer);
  }, [games]);

  const handleNavigate = (id) => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else navigate(`/game/${id}`);
  };

  if (!games.length) return null;
  const game = games[index];
  return (
    <div className="hero-carousel">
      <div
        className="hero-bg"
        style={{
          backgroundImage: `url(${
            game.background_image ||
            game.short_screenshots?.[0]?.image
          })`,
        }}
      />

      {/* DARK GRADIENT */}
      <div className="hero-overlay" />

      {/* CONTENT */}
      <div className="hero-content">
        <span className="hero-badge">Suggested for you</span>

        <h1>{game.name}</h1>
        <p>⭐ {game.rating} / 5</p>
        <p>📅 Released: {game.released}</p>

        <button onClick={() => handleNavigate(game.id)}>
          View Game
        </button>
      </div>

      {/* CONTROLS */}
      <button className="hero-arrow left" onClick={() =>
        setIndex((index - 1 + games.length) % games.length)
      }>
        ❮
      </button>

      <button className="hero-arrow right" onClick={() =>
        setIndex((index + 1) % games.length)
      }>
        ❯
      </button>
    </div>
  );
};

export default GameCarouselCard;
