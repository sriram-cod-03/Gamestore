import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requireAuthAndNavigate } from "../utils/auth";

// CACHE VARIABLE
let freeGameCache = null;

const FreeGameCard = () => {
  const [FreeGameData, setFreeGameData] = useState(freeGameCache || []);
  const [isLoading, setIsLoading] = useState(!freeGameCache);
  const [FCcurrentIndex, setFCcurrentIndex] = useState(0);
  const FCitemsPerPage = 4;
  const navigate = useNavigate();

  const FreeGames = [
    "Fortnite Battle Royale",
    "Rocket League",
    "Genshin Impact",
    "PlayerUnknown’s Battlegrounds",
    "Valorant",
    "Marvel Rivals",
    "The Sims 4",
    "Asphalt 8: Airborne",
  ];

  useEffect(() => {
    if (freeGameCache) return;

    const fetchFreeGames = async () => {
      const apiKey = "10339595c43349fe932bbf361059223a";
      const gameData = [];

      for (const name of FreeGames) {
        const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(
          name
        )}&key=${apiKey}`;

        try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            gameData.push(data.results[0]);
          }
        } catch (err) {
          console.error("Fetch error for", name, err);
        }
      }

      freeGameCache = gameData; // cache store
      setFreeGameData(gameData);
      setIsLoading(false);
    };

    fetchFreeGames();
  }, []);

  const handleNext = () => {
    if (FCcurrentIndex + FCitemsPerPage < FreeGameData.length) {
      setFCcurrentIndex(FCcurrentIndex + FCitemsPerPage);
    }
  };

  const handlePrev = () => {
    if (FCcurrentIndex - FCitemsPerPage >= 0) {
      setFCcurrentIndex(FCcurrentIndex - FCitemsPerPage);
    }
  };

  if (isLoading) return <p className="text-center text-white"></p>;
  if (!isLoading && FreeGameData.length === 0)
    return <p className="text-center text-white"></p>;

  return (
    <div className="container mt-4 position-relative">
      <h4 className="mt-3 text-white">Online games</h4>
      <div className="row">
        {FreeGameData.slice(
          FCcurrentIndex,
          FCcurrentIndex + FCitemsPerPage
        ).map((game) => (
          <div className="col-md-3 mb-4" key={game.id}>
            <div className="card h-100 shadow">
              <img
                src={game.background_image}
                alt={game.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div
                className="card-body text-white"
                style={{ backgroundColor: "black" }}
              >
                <h5 className="card-title">{game.name}</h5>
                <p className="card-text"> Rating: {game.rating}</p>
                <p className="card-text"> Released: {game.released}</p>
                <p className="card-text">
                  Genres: {game.genres.map((g) => g.name).join(", ")}
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    requireAuthAndNavigate(navigate, `/game/${game.id}`)
                  }
                >
                  Show more
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="position-absolute top-0 end-0 me-3 mt-2"
        style={{ zIndex: 5 }}
      >
        <button
          className="btn me-2"
          onClick={handlePrev}
          disabled={FCcurrentIndex === 0}
        >
          ⬅
        </button>

        <button
          className="btn me-2"
          onClick={handleNext}
          disabled={FCcurrentIndex + FCitemsPerPage >= FreeGameData.length}
        >
          ➡
        </button>
      </div>
    </div>
  );
};

export default FreeGameCard;
