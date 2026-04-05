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
    // --- 1. SMART USER DATA RETRIEVAL ---
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        // Priority: 1. firstName -> 2. username -> 3. email prefix -> 4. "Player"
        const nameToDisplay = 
          userData.firstName || 
          userData.username || 
          (userData.email ? userData.email.split("@")[0] : "Player");

        // Set the name and ensure it's just the first word
        setUserName(nameToDisplay.split(" ")[0]);
      } catch (err) {
        console.error("Error parsing user data", err);
        setUserName("Player");
      }
    }

    // --- 2. HIDE LOADING SCREEN ---
    if (typeof setAppLoading === "function") {
      setTimeout(() => setAppLoading(false), 800);
    }
  }, [setAppLoading]);

  return (
    <div className="home-main-wrapper" style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      
      {/* --- PERSONALIZED WELCOME --- */}
      <div className="container pt-4 mb-4">
        <h1 style={{ 
          fontSize: "32px", 
          fontWeight: "900", 
          color: "#fff", 
          textTransform: "uppercase",
          letterSpacing: "2px" 
        }}>
          Welcome back, <span style={{ color: "#00ff88", textShadow: "0 0 10px rgba(0, 255, 136, 0.3)" }}>
            {userName}
          </span>
        </h1>
      </div>

      {/* 1. HERO CAROUSEL */}
      <div className="container">
        <GameCarouselCard />
      </div>

      {/* 2. RECOMMENDED SECTION */}
      <section className="recommended-container container">
        <RecommendedGameCards />
      </section>

      {/* 3. TRENDING SECTION */}
      <section className="trending-container container">
        <TrendingGameCard />
      </section>

      {/* 4. FREE-TO-PLAY SECTION */}
      <section className="free-container container">
        <FreeGameCard />
      </section>

      {/* 5. HORROR SECTION */}
      <section className="horror-container container">
        <HorrorCard />
      </section>

      <div className="pb-5"></div>
    </div>
  );
};

export default Home;