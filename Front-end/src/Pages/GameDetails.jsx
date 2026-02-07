import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);

        const gameRes = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
        );
        const gameData = await gameRes.json();

        const screenRes = await fetch(
          `https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`
        );
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

    fetchGame();
  }, [id]);

  if (loading)
    return <p className="text-center mt-4 text-white">Loading...</p>;

  if (error)
    return <p className="text-center mt-4 text-danger">{error}</p>;

  if (!game)
    return <p className="text-center mt-4 text-white">Game not found</p>;

  return (
    <div className="container mt-4 text-white">
      <h2>{game.name}</h2>

      {game.background_image && (
        <img
          src={game.background_image}
          alt={game.name}
          className="img-fluid rounded mb-3"
        />
      )}

      <p><strong>⭐ Rating:</strong> {game.rating}</p>
      <p><strong>📅 Released:</strong> {game.released}</p>
      <p><strong>⏳ Playtime:</strong> {game.playtime} hrs</p>

      <p>
        <strong>🎮 Platforms:</strong>{" "}
        {game.platforms?.map(p => p.platform.name).join(", ")}
      </p>

      <p>
        <strong>📖 Description:</strong><br />
        {game.description_raw || "No description available"}
      </p>

      <h4 className="mt-4">Screenshots</h4>
      <div className="row">
        {screenshots.map(shot => (
          <div key={shot.id} className="col-md-4 mb-3">
            <img
              src={shot.image}
              alt="screenshot"
              className="img-fluid rounded"
            />
          </div>
        ))}
      </div>

      <button
        className="btn btn-outline-warning mt-3"
        onClick={() => navigate(`/payment/${id}`)}
      >
        Buy Now
      </button>
    </div>
  );
};

export default GameDetails;
