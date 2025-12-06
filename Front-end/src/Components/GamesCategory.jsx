import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { requireAuthAndNavigate } from "../utils/auth";

const categoryGameNames = {
  playstation: [
    "God of War",
    "Uncharted 4",
    "Spider-Man",
    "The Last of Us Part II",
  ],
  xbox: ["Halo Infinite", "Forza Horizon 5", "Gears 5"],
  nintendo: [
    "The Legend of Zelda: Breath of the Wild",
    "Mario Kart 8 Deluxe",
  ],
  digital: ["FIFA 24", "Call of Duty: Warzone", "Valorant"],
};

const GamesCategory = () => {
  const { category } = useParams();
  const normalizedCategory = category?.toLowerCase();
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const apiKey = "10339595c43349fe932bbf361059223a";

  useEffect(() => {
    const fetchGames = async () => {
      const names = categoryGameNames[normalizedCategory] || [];
      const fetchedGames = [];

      for (const name of names) {
        try {
          const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(
            name
          )}&key=${apiKey}`;
          const res = await fetch(url);
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            fetchedGames.push(data.results[0]);
          }
        } catch (err) {
          console.error("Error fetching", name, err);
        }
      }

      setGames(fetchedGames);
    };

    fetchGames();
  }, [normalizedCategory]);

  if (!categoryGameNames[normalizedCategory]) {
    return (
      <div className="container mt-5 text-center text-white">
        <h3> Category not found!</h3>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="container mt-5 d-flex align-items-center text-white">
        <strong>Loading {normalizedCategory} games...</strong>
        <div className="spinner-border ms-3" role="status"></div>
      </div>
    );
  }

  const handleShowMore = (id) => {
    requireAuthAndNavigate(navigate, `/game/${id}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-capitalize text-warning mb-4 text-center">
        {normalizedCategory} Games
      </h2>

      {/* Carousel Section */}
      <div
        id="categoryCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div
                className="card text-white text-center border-0"
                style={{
                  backgroundColor: "#111",
                  cursor: "pointer",
                }}
              >
                <img
                  src={
                    game.short_screenshots?.[0]?.image || game.background_image
                  }
                  alt={game.name}
                  className="card-img-top"
                  style={{
                    height: "500px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                <div className="card-body">
                  <h4 className="card-title">{game.name}</h4>
                  <p className="card-text text-muted">
                    Released: {game.released || "N/A"}
                  </p>
                  <p className="card-text">
                    ⭐ Rating: {game.rating || "N/A"} / 5
                  </p>
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => handleShowMore(game.id)}
                  >
                    Show More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#categoryCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#categoryCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  );
};

export default GamesCategory;
