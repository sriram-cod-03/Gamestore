import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requireAuthAndNavigate } from "../utils/auth";

// CACHE
let recommendedCache = null;

const RecommendedGameCards = () => {
  const [recommendedGameData, setRecommendedGameData] = useState(
    recommendedCache || []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!recommendedCache);

  const itemsPerPage = 4;
  const navigate = useNavigate();

  const RecommendedGames = [
    "The Witcher",
    "Call of Duty: WWII",
    "Red Dead Redemption",
    "Assassin’s Creed IV: Black Flag",
    "Cyberpunk 2077",
    "GTA V",
    "Elden Ring",
    "Hogwarts Legacy",
  ];

  useEffect(() => {
    if (recommendedCache) return;

    const fetchRecommendedGames = async () => {
      const apiKey = "10339595c43349fe932bbf361059223a";
      const gameData = [];

      for (const name of RecommendedGames) {
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

      recommendedCache = gameData; // cache
      setRecommendedGameData(gameData);
      setIsLoading(false);
    };

    fetchRecommendedGames();
  }, []);

  const handleShowMore = (gameId) => {
    requireAuthAndNavigate(navigate, `/game/${gameId}`);
  };

  const handleNext = () => {
    if (currentIndex + itemsPerPage < recommendedGameData.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <p className="text-center text-white mt-4"></p>
      </div>
    );
  }

  if (!isLoading && recommendedGameData.length === 0) {
    return (
      <div className="container mt-4">
        <p className="text-center text-white mt-4"></p>
      </div>
    );
  }

  return (
    <div className="container mt-4 position-relative">
      <h4 className="mt-3 text-white">Recommended Game</h4>

      <div className="row">
        {recommendedGameData
          .slice(currentIndex, currentIndex + itemsPerPage)
          .map((game) => (
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
                  <p className="card-text">⭐ Rating: {game.rating} / 5</p>
                  <p className="card-text">📅 Released: {game.released}</p>
                  <p className="card-text">
                    🎮 Genres: {game.genres.map((g) => g.name).join(", ")}
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleShowMore(game.id)}
                  >
                    Show More
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {recommendedGameData.length > itemsPerPage && (
        <div
          className="position-absolute top-0 end-0 me-3 mt-2"
          style={{ zIndex: 5 }}
        >
          <button
            className="btn me-2"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ⬅
          </button>
          <button
            className="btn"
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= recommendedGameData.length}
          >
            ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendedGameCards;
