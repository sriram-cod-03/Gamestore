import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/gameCarousel.css";

const API_KEY = "10339595c43349fe932bbf361059223a";

const SHOWCASE_PRESETS = [
  {
    id: 3498,
    name: "Grand Theft Auto V",
    subtitle: "BUY GRAND THEFT AUTO V - PRE-OWNED & PRE-ORDER EDITIONS",
    description: "Experience the blockbuster open-world critically acclaimed action-adventure. Fast shipping across India.",
    price: "₹1,999",
    tags: ["PC GAMES", "PS5 GAMES", "TOP RATED"]
  },
  {
    id: 28,
    name: "Red Dead Redemption 2",
    subtitle: "BUY RED DEAD REDEMPTION 2 - PS5 & XBOX SERIES EDITIONS",
    description: "America, 1899. The end of the wild west era has begun. Live the epic outlaw story across the heartland.",
    price: "₹2,499",
    tags: ["OPEN WORLD", "PS5 GAMES", "BESTSELLER"]
  },
  {
    id: 4200,
    name: "Portal 2",
    subtitle: "BUY PORTAL 2 ULTIMATE EDITION - MAGIC LAND GAMES",
    description: "Award-winning gameplay, dark comedy, and mind-bending portal puzzles designed for tactical thinkers.",
    price: "₹999",
    tags: ["PUZZLE", "CO-OP", "CLASSIC"]
  },
  {
    id: 58175,
    name: "God of War",
    subtitle: "GOD OF WAR - PLAYSTATION HITS & REMASTERED",
    description: "His vengeance against the Gods of Olympus far behind him, Kratos now lives in the realm of Norse deities.",
    price: "₹3,299",
    tags: ["PS5 GAMES", "ACTION", "EXCLUSIVE"]
  },
  {
    id: 41494,
    name: "Cyberpunk 2077",
    subtitle: "CYBERPUNK 2077: PHANTOM LIBERTY BUNDLE",
    description: "An open-world, action-adventure RPG set in the megalopolis of Night City, obsessed with power and glam.",
    price: "₹2,999",
    tags: ["RAY TRACING", "RPG", "SCI-FI"]
  },
  {
    id: 3272,
    name: "Rocket League",
    subtitle: "ROCKET LEAGUE ULTIMATE CHAMPION BUNDLE",
    description: "High-powered hybrid of arcade-style soccer and vehicular mayhem with fluid physics-driven gameplay.",
    price: "₹1,499",
    tags: ["MULTIPLAYER", "SPORTS", "ESPORTS"]
  }
];

let carouselCache = null;
const AUTO_SLIDE_TIME = 6000;

const GameCarouselCard = () => {
  const [games, setGames] = useState(carouselCache || []);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(!carouselCache);
  const [liked, setLiked] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (carouselCache) return;

    const fetchLiveCarouselData = async () => {
      try {
        setLoading(true);

        const requests = SHOWCASE_PRESETS.map(async (preset) => {
          try {
            const res = await fetch(`https://api.rawg.io/api/games/${preset.id}?key=${API_KEY}`);
            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();
            return {
              ...preset,
              image: data.background_image || data.background_image_additional,
              rating: data.rating || "4.5"
            };
          } catch {
            return {
              ...preset,
              image: `https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=80`,
              rating: "4.5"
            };
          }
        });

        const resolvedGames = await Promise.all(requests);
        carouselCache = resolvedGames;
        setGames(resolvedGames);
      } catch (err) {
        console.error("Carousel load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveCarouselData();
  }, []);

  useEffect(() => {
    if (!games.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % games.length);
    }, AUTO_SLIDE_TIME);

    return () => clearInterval(timer);
  }, [games.length, index]);

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAction = (id) => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else navigate(`/game/${id}`);
  };

  if (loading || !games.length) {
    return (
      <div className="magic-carousel-wrapper magic-skeleton">
        <div className="magic-spinner"></div>
      </div>
    );
  }

  const currentGame = games[index];

  return (
    <div className="magic-carousel-wrapper">
      
      {/* 1. BACKGROUND IMAGE LAYER */}
      <div className="magic-image-container">
        <img
          key={currentGame.id}
          src={currentGame.image}
          alt={currentGame.name}
          className="magic-bg-image"
          loading="eager"
          decoding="async"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=80";
          }}
        />
        <div className="magic-image-dark-overlay" />
      </div>

      {/* 2. HERO CONTENT OVERLAY */}
      <div className="magic-content-overlay">
        
        {/* TOP PILL TAGS */}
        <div className="magic-tags-row">
          {currentGame.tags.map((tag, idx) => (
            <span key={idx} className={`magic-tag-pill ${idx === 0 ? "highlight" : ""}`}>
              {tag}
            </span>
          ))}
        </div>

        {/* SUBTITLE */}
        <p className="magic-subtitle">{currentGame.subtitle}</p>

        {/* TITLE */}
        <h1 className="magic-title">{currentGame.name}</h1>

        {/* SHORT DESCRIPTION */}
        <p className="magic-desc">{currentGame.description}</p>

        {/* PRICE & RATING ROW */}
        <div className="magic-pricing-row">
          <span className="price-label">PRE-ORDER / BUY</span>
          <span className="price-tag">{currentGame.price}</span>
          <span className="magic-rating">
            <FaStar className="star-icon" /> {currentGame.rating}
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="magic-actions-row">
          <button 
            className="magic-order-btn" 
            onClick={() => handleAction(currentGame.id)}
          >
            SHOWMORE
          </button>
          
          <button 
            className={`magic-wishlist-btn ${liked[currentGame.id] ? "active" : ""}`} 
            onClick={(e) => toggleLike(e, currentGame.id)}
            aria-label="Add to Wishlist"
          >
            {liked[currentGame.id] ? <FaHeart className="heart-active" /> : <FaRegHeart />}
          </button>
        </div>

        {/* BOTTOM PROGRESS BAR & INDEX COUNTER */}
        <div className="magic-progress-section">
          <div className="magic-bullets">
            {games.map((_, i) => (
              <button
                key={i}
                className={`magic-bullet ${i === index ? "active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
              >
                {i === index && <span className="magic-bullet-fill" />}
              </button>
            ))}
          </div>

          <span className="magic-counter">
            0{index + 1} <span className="counter-sep">/</span> 0{games.length}
          </span>
        </div>

      </div>

      {/* SIDE ARROWS */}
      <button 
        className="magic-nav-arrow left" 
        onClick={() => setIndex((index - 1 + games.length) % games.length)}
        aria-label="Previous Game"
      >
        <FaChevronLeft />
      </button>

      <button 
        className="magic-nav-arrow right" 
        onClick={() => setIndex((index + 1) % games.length)}
        aria-label="Next Game"
      >
        <FaChevronRight />
      </button>

    </div>
  );
};

export default GameCarouselCard;