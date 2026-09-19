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

const RAWG_API_KEY = "10339595c43349fe932bbf361059223a";

// Essential game IDs to pre-cache before hiding loader
const PRELOAD_IDS = [3498, 28, 4200, 58175];

const Home = ({ setAppLoading }) => {
  const [userName, setUserName] = useState("Player");

  useEffect(() => {
    // 1. User details setup
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

    // 2. Pre-fetch API & Images before removing preloader
    let isMounted = true;

    const preloadHomeAssets = async () => {
      try {
        const fetchPromises = PRELOAD_IDS.map(async (id) => {
          try {
            const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`);
            if (!res.ok) return null;
            const data = await res.json();
            
            // Prefetch and cache image into browser memory
            if (data.background_image) {
              await new Promise((resolve) => {
                const img = new Image();
                img.src = data.background_image;
                img.onload = resolve;
                img.onerror = resolve;
              });
            }
            return data;
          } catch {
            return null;
          }
        });

        // Wait for all initial cards to load in parallel (max 2.2s fallback)
        await Promise.race([
          Promise.all(fetchPromises),
          new Promise((resolve) => setTimeout(resolve, 2200))
        ]);
      } catch (err) {
        console.error("Preload error:", err);
      } finally {
        if (isMounted && typeof setAppLoading === "function") {
          setAppLoading(false);
        }
      }
    };

    preloadHomeAssets();

    return () => {
      isMounted = false;
    };
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