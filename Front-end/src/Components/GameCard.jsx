import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useShop } from "../context/ShopContext";

const GameCard = ({ game }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, addToCart } = useShop();

  const fav = isFavorite(game.id);
  const price = game.price || 1299 + (game.id % 2000);

  return (
    <div
      className="game-catalog-card"
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <div className="card-thumb-wrap">
        <img
          src={
            game.background_image ||
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"
          }
          alt={game.name}
          className="card-thumb-img"
          loading="lazy"
        />

        {/* HEART FAVORITE BUTTON */}
        <button
          type="button"
          className={`card-heart-btn ${fav ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite({ ...game, price });
          }}
          title={fav ? "Remove from Favorites" : "Add to Favorites"}
        >
          {fav ? <FaHeart color="#ff4d4d" /> : <FaRegHeart />}
        </button>

        <span className="card-rating-badge">
          <FaStar className="star" /> {game.rating || "4.0"}
        </span>
      </div>

      <div className="card-meta">
        <span className="card-release">
          {game.released ? game.released.substring(0, 4) : "2024"}
        </span>
        <h3 className="card-title" title={game.name}>
          {game.name}
        </h3>

        <div className="card-footer-row">
          <span className="card-price">₹{price.toLocaleString()}</span>

          {/* ADD TO CART BUTTON */}
          <button
            type="button"
            className="card-cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ ...game, price });
            }}
          >
            <FaShoppingCart /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;