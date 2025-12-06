import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//CACHE
let carouselGamesCache = null;

const GameCarouselCard = () => {
  const [games, setGames] = useState(carouselGamesCache || []);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(!carouselGamesCache);
  const navigate = useNavigate();

  const SuggestionGameNames = [
    "Grand Theft Auto V",
    "Red Dead Redemption 2",
    "Assassin's Creed Valhalla",
    "God of War III",
    "Saints Row: The Third",
    "Need for Speed",
  ];

  useEffect(() => {
    if (carouselGamesCache) return;

    const fetchGameDetails = async () => {
      const apiKey = "10339595c43349fe932bbf361059223a";
      const fetchedGames = [];

      for (const name of SuggestionGameNames) {
        const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(
          name
        )}&key=${apiKey}`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            fetchedGames.push(data.results[0]);
          }
        } catch (err) {
          console.error("Error fetching", name, err);
        }
      }

      carouselGamesCache = fetchedGames;   //  cache
      setGames(fetchedGames);
      setIsLoading(false);
    };

    fetchGameDetails();
  }, []);

  const handleCardClick = (gameId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate(`/game/${gameId}`);
    }
  };

  const handleShowMore = async (gameId) => {
    const apiKey = "10339595c43349fe932bbf361059223a";
    const url = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setSelectedGame(data);
    } catch (err) {
      console.error("Error fetching details:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex align-items-center" style={{ color: "white" }}>
        <strong role="status">Loading...</strong>
        <div className="spinner-border ms-auto" aria-hidden="true"></div>
      </div>
    );
  }

  if (!isLoading && games.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div
        id="favoriteGameCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <h4 className="mb-3 text-white">Suggest for you</h4>
        <div className="carousel-inner">
          {games.map((game, index) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              key={game.id}
            >
              <div
                className="card text-center"
                style={{ cursor: "pointer" }}
                onClick={() => handleCardClick(game.id)}
              >
                <img
                  src={
                    game.short_screenshots?.[0]?.image || game.background_image
                  }
                  className="card-img-top"
                  alt={game.name}
                  style={{ height: "800px", objectFit: "cover" }}
                />
                <div
                  className="card-body text-white"
                  style={{ backgroundColor: "black" }}
                >
                  <h5 className="card-title">{game.name}</h5>
                  <p className="card-text">Released: {game.released}</p>
                  <p className="card-text">Rating: {game.rating} / 5</p>
                  <small className="text-white">
                     Click to view (Login required)
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#favoriteGameCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#favoriteGameCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
        </button>
      </div>

      {selectedGame && (
        <div className="card mt-4 text-white" style={{ background: "#222" }}>
          <div className="card-body">
            <h3>{selectedGame.name}</h3>
            <p dangerouslySetInnerHTML={{ __html: selectedGame.description }} />
            <p> Rating: {selectedGame.rating} / 5</p>
            <p> Released: {selectedGame.released}</p>
            <p> Playtime: {selectedGame.playtime} hrs</p>
            <button
              className="btn btn-danger mt-2"
              onClick={() => setSelectedGame(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCarouselCard;
