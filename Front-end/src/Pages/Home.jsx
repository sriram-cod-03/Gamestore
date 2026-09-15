import React, { useEffect, useState } from "react";
import "../styles/home.css";
import "../styles/recommended.css";
import "../styles/trending.css";
import "../styles/freeGames.css";
import "../styles/horror.css";
import "../styles/gameCarousel.css";

// Components
import GameCarouselCard from "../Components/GameCarouselCard";
import RecommendedGameCards from "../Components/RecommendedCard";
import TrendingGameCard from "../Components/TrendingCard";
import FreeGameCard from "../Components/Freecard";
import HorrorCard from "../Components/HorrorCard";

const Home = ({ setAppLoading }) => {
  const [userName, setUserName] = useState("Player");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const nameToDisplay = 
          userData.firstName || 
          userData.username || 
          (userData.email ? userData.email.split("@")[0] : "Player");

        setUserName(nameToDisplay.split(" ")[0]);
      } catch (err) {
        console.error("Error parsing user data", err);
        setUserName("Player");
      }
    }

    if (typeof setAppLoading === "function") {
      setTimeout(() => setAppLoading(false), 800);
    }
  }, [setAppLoading]);

  return (
    <div className="home-main-wrapper">
      {/* AMBIENT GRID TEXTURE */}
      <div className="home-ambient-grid" />

      {/* CONTENT WRAPPER */}
      <div className="home-content-layer">
        
        {/* PERSONALIZED WELCOME BANNER */}
        <div className="home-container home-welcome-section">
          <div className="welcome-badge-wrap">
            <span className="status-dot"></span>
            <span className="welcome-badge-text">Player Online</span>
          </div>

          <h1 className="home-welcome-text">
            WELCOME BACK, <span className="user-glow-name">{userName}</span>
          </h1>
        </div>

        {/* 1. HERO CAROUSEL */}
        <div className="home-container home-section-spacer">
          <GameCarouselCard />
        </div>

        {/* 2. RECOMMENDED SECTION */}
        <section className="home-container recommended-container home-section-spacer">
          <RecommendedGameCards />
        </section>

        {/* 3. TRENDING SECTION */}
        <section className="home-container trending-container home-section-spacer">
          <TrendingGameCard />
        </section>

        {/* 4. FREE-TO-PLAY SECTION */}
        <section className="home-container free-container home-section-spacer">
          <FreeGameCard />
        </section>

        {/* 5. HORROR SECTION */}
        <section className="home-container horror-container home-section-spacer">
          <HorrorCard />
        </section>

        <div style={{ paddingBottom: "50px" }}></div>
      </div>
    </div>
  );
};

export default Home;