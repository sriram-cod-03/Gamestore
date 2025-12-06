import { useParams, useNavigate } from "react-router-dom"; // ✅ useNavigate import
import { useEffect, useState } from "react";

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games/${id}?key=10339595c43349fe932bbf361059223a`
        );
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchScreenshots = async () => {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games/${id}/screenshots?key=10339595c43349fe932bbf361059223a`
        );
        const data = await res.json();
        setScreenshots(data.results || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGame();
    fetchScreenshots();
  }, [id]);

  if (!game) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4 text-white">
      <h2>{game.name}</h2>

      <img
        src={game.background_image}
        className="img-fluid mb-3"
        alt={game.name}
      />

      <p><strong>⭐ Rating:</strong> {game.rating}</p>
      <p><strong>📅 Released:</strong> {game.released}</p>
      <p><strong>⏳ Playtime:</strong> {game.playtime} hrs</p>
      <p>
        <strong>🎮 Platforms:</strong>{" "}
        {game.platforms?.map((p) => p.platform.name).join(", ")}
      </p>
      <p><strong>📖 Description:</strong> {game.description_raw}</p>

      {/* Screenshots */}
      <h4 className="mt-4">Screenshots</h4>
      <div className="row">
        {screenshots.map((shot) => (
          <div key={shot.id} className="col-md-4 mb-3">
            <img
              src={shot.image}
              alt="screenshot"
              className="img-fluid rounded"
            />
          </div>
        ))}
      </div>

      {/* ✅ BUY BUTTON */}
      <div className="mt-3">
        <button
          type="button"
          className="btn btn-outline-warning"
          onClick={() => navigate(`/payment/${id}`)} // ✅ works now
        >
          Buy now
        </button>
      </div>
    </div>
  );
};

export default GameDetails;
