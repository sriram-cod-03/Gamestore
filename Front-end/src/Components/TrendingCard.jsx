import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requireAuthAndNavigate } from "../utils/auth";

// CACHE
let trendingCache = null;

const TrendingGameCard = () => {
  const [TrendingGameData, setTrendingGameData] = useState(
    trendingCache || []
  );
  const [TRGcurrentIndex, setTRGcurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!trendingCache);
  const TGRItemsPerPage = 4;

  const navigate = useNavigate();

  const TrendingGames = [
    "Titan Quest 2",
    "2010 FIFA World Cup",
    "Wuchang: Fallen Feathers",
    "Black Myth: Wukong",
    "Far Cry 6",
    "Watch Dogs",
    "Battlefield 2022",
    "Detroit: Become Human",
  ];

  useEffect(() => {
    if (trendingCache) return;

    const fetchTrendingGames = async () => {
      const apiKey = "10339595c43349fe932bbf361059223a";
      const gameData = [];

      for (const name of TrendingGames) {
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

      trendingCache = gameData; // cache
      setTrendingGameData(gameData);
      setIsLoading(false);
    };

    fetchTrendingGames();
  }, []);

  const handleNext = () => {
    if (TRGcurrentIndex + TGRItemsPerPage < TrendingGameData.length) {
      setTRGcurrentIndex(TRGcurrentIndex + TGRItemsPerPage);
    }
  };

  const handlePrev = () => {
    if (TRGcurrentIndex - TGRItemsPerPage >= 0) {
      setTRGcurrentIndex(TRGcurrentIndex - TGRItemsPerPage);
    }
  };

  if (isLoading) return <p className="text-center text-white"></p>;
  if (!isLoading && TrendingGameData.length === 0)
    return <p className="text-center text-white"></p>;

  return (
    <div className="container mt-4 position-relative">
      <h4 className="mb-3 text-white">Trending Games</h4>

      <div className="row">
        {TrendingGameData.slice(
          TRGcurrentIndex,
          TRGcurrentIndex + TGRItemsPerPage
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
                <p className="card-text">🎯 Rating: {game.rating} / 5</p>
                <p className="card-text">📅 Released: {game.released}</p>
                <p className="card-text">
                  🎮 Genres: {game.genres.map((g) => g.name).join(", ")}
                </p>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    requireAuthAndNavigate(navigate, `/game/${game.id}`)
                  }
                >
                  Show More
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
          disabled={TRGcurrentIndex === 0}
        >
          ⬅
        </button>

        <button
          className="btn"
          onClick={handleNext}
          disabled={
            TRGcurrentIndex + TGRItemsPerPage >= TrendingGameData.length
          }
        >
          ➡
        </button>
      </div>
    </div>
  );
};

export default TrendingGameCard;
