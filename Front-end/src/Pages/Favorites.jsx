import React from "react";
import { useShop } from "../context/ShopContext";
import GameCard from "../Components/GameCard";
import "../styles/favorites.css"; // Create or add styling as needed

const Favorites = () => {
  const { favorites } = useShop();

  return (
    <div className="favorites-page-container">
      <h2 className="page-title">Your Favorite Games ❤️</h2>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>No favorites added yet!</p>
        </div>
      ) : (
        <div className="platform-games-grid">
          {favorites.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;