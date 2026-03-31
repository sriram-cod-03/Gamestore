import React, { useEffect, useState } from "react";
// Import all your custom CSS files
import "../styles/recommended.css";
import "../styles/trending.css";
import "../styles/freeGames.css";
import "../styles/horror.css";
import "../styles/gameCarousel.css";

// Import your Components
import GameCarouselCard from "../Components/GameCarouselCard";
import RecommendedGameCards from "../Components/RecommendedCard";
import TrendingGameCard from "../Components/TrendingCard";
import FreeGameCard from "../Components/Freecard";
import HorrorCard from "../Components/HorrorCard";

const Home = ({ setAppLoading }) => {
  const [userName, setUserName] = useState("Player");

  useEffect(() => {
    // 1. Get Logged-in User Data
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const nameToDisplay = userData.firstName || userData.name || "Player";
        setUserName(nameToDisplay.split(" ")[0]);
      } catch (err) {
        setUserName("Player");
      }
    }

    // 2. Hide loading screen
    if (typeof setAppLoading === "function") {
      setTimeout(() => setAppLoading(false), 800);
    }
  }, [setAppLoading]);

  return (
    <div className="home-main-wrapper" style={{ backgroundColor: "#000" }}>
      
      {/* --- PERSONALIZED WELCOME --- */}
      <div className="container pt-4 mb-4">
        <h1 style={{ 
          fontSize: "32px", 
          fontWeight: "800", 
          color: "#fff", 
          textTransform: "uppercase",
          letterSpacing: "1px" 
        }}>
          Welcome back, <span style={{ color: "#00ff88" }}>{userName}</span>
        </h1>
      </div>

      {/* 1. HERO CAROUSEL (Uses gameCarousel.css) */}
      <div className="container">
        <GameCarouselCard />
      </div>

      {/* 2. RECOMMENDED SECTION (Uses recommended.css classes) */}
      <section className="recommended-container container">
        <div className="recommended-header">
        </div>
        <RecommendedGameCards />
      </section>

      {/* 3. TRENDING SECTION (Uses trending.css classes) */}
      <section className="trending-container container">
        <div className="trending-header">
        </div>
        <TrendingGameCard />
      </section>

      {/* 4. FREE-TO-PLAY SECTION (Uses freeGames.css classes) */}
      <section className="free-container container">
        <div className="free-header">
        </div>
        <FreeGameCard />
      </section>

      {/* 5. HORROR SECTION (Uses horror.css classes) */}
      <section className="horror-container container">
        <HorrorCard />
      </section>

      <div className="pb-5"></div>
    </div>
  );
};

export default Home;