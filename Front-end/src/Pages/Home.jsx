import React, { useEffect } from "react";
import GameCarouselCard from "../Components/GameCarouselCard";
import RecommendedGameCards from "../Components/RecommendedCard";
import TrendingGameCard from "../Components/TrendingCard";
import FreeGameCard from "../Components/Freecard";
import HorrorCard from "../Components/HorrorCard";

const Home = ({ setAppLoading }) => {
  useEffect(() => {
    const apiKey = "10339595c43349fe932bbf361059223a";

    const fetchAllHomeData = async () => {
      try {
        const sections = [
          `https://api.rawg.io/api/games?page_size=1&key=${apiKey}`,
          `https://api.rawg.io/api/games?page_size=1&ordering=-rating&key=${apiKey}`,
          `https://api.rawg.io/api/games?page_size=1&tags=free-to-play&key=${apiKey}`
        ];

        // Wait for all API handshakes
        await Promise.all(sections.map(url => fetch(url)));

        // Give a tiny buffer for images
        setTimeout(() => {
          // ✅ Safety Check: only call if function exists
          if (typeof setAppLoading === "function") {
            setAppLoading(false);
          }
        }, 500);

      } catch (error) {
        console.error("API Error:", error);
        if (typeof setAppLoading === "function") {
          setAppLoading(false);
        }
      }
    };

    fetchAllHomeData();
  }, [setAppLoading]);

  return (
    <div className="container mt-3">
      {/* 1. Main Feature Carousel */}
      <GameCarouselCard />

      {/* 2. Recommended Section */}
      <div className="mt-5">
        <RecommendedGameCards />
      </div>

      {/* 3. Trending Section */}
      <div className="mt-5">
        <TrendingGameCard />
      </div>

      {/* 4. Free to Play Section */}
      <div className="mt-5">
        <FreeGameCard />
      </div>

      {/* 5. Horror Section */}
      <div className="mt-5">
        <HorrorCard />
      </div>

      {/* Bottom Padding for Footer spacing */}
      <div className="pb-5"></div>
    </div>
  );
};

export default Home;