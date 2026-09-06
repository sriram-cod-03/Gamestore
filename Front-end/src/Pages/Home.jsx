import React, { useEffect, useState } from "react";
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
    <div className="home-main-wrapper" style={{ backgroundColor: "#000", minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* PERSONALIZED WELCOME */}
      <div className="app-container" style={{ paddingTop: "24px", marginBottom: "18px" }}>
        <h1 className="home-welcome-text" style={{ 
          fontSize: "clamp(1.25rem, 3.5vw, 2rem)", 
          fontWeight: "900", 
          color: "#fff", 
          textTransform: "uppercase",
          letterSpacing: "1px",
          margin: 0,
          lineHeight: 1.2
        }}>
          Welcome back,{" "}
          <span style={{ color: "#00ff88", textShadow: "0 0 10px rgba(0, 255, 136, 0.3)" }}>
            {userName}
          </span>
        </h1>
      </div>

      {/* 1. HERO CAROUSEL */}
      <div className="app-container" style={{ marginBottom: "35px" }}>
        <GameCarouselCard />
      </div>

      {/* 2. RECOMMENDED SECTION */}
      <section className="app-container recommended-container" style={{ marginBottom: "35px" }}>
        <RecommendedGameCards />
      </section>

      {/* 3. TRENDING SECTION */}
      <section className="app-container trending-container" style={{ marginBottom: "35px" }}>
        <TrendingGameCard />
      </section>

      {/* 4. FREE-TO-PLAY SECTION */}
      <section className="app-container free-container" style={{ marginBottom: "35px" }}>
        <FreeGameCard />
      </section>

      {/* 5. HORROR SECTION */}
      <section className="app-container horror-container" style={{ marginBottom: "35px" }}>
        <HorrorCard />
      </section>

      <div style={{ paddingBottom: "40px" }}></div>
    </div>
  );
};

export default Home;