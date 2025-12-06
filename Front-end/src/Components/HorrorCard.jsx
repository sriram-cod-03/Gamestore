import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// CACHE
let horrorGameCache = null;

const HorrorCard = () => {
  const [HorrorGameData, setHorrorGameData] = useState(horrorGameCache || []);
  const [isLoading, setIsLoading] = useState(!horrorGameCache);
  const navigate = useNavigate();

  const HorrorGames = [
    "Resident Evil: Village",
    "Resident Evil (2002)",
    "Song of Horror",
    "The Backrooms 1998 - Found Footage Survival Horror Game",
  ];

  useEffect(() => {
    if (horrorGameCache) return;

    const fetchHorrorGames = async () => {
      const apiKey = "10339595c43349fe932bbf361059223a";
      const tempData = [];

      for (const name of HorrorGames) {
        const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(
          name
        )}&key=${apiKey}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            tempData.push(data.results[0]);
          }
        } catch (err) {
          console.error("fetch error", err);
        }
      }
      horrorGameCache = tempData;    //cache
      setHorrorGameData(tempData);
      setIsLoading(false);
    };

    fetchHorrorGames();
  }, []);

  if (isLoading) return <p className="text-center text-white"></p>;
  if (!isLoading && HorrorGameData.length === 0)
    return <p className="text-center text-white"></p>;

  return (
    <div className="container mt-4">
      <h4 className="mt-3 text-white">Horror Games</h4>
      <div className="row">
        {HorrorGameData.map((game) => (
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
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  Show more
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorrorCard;
