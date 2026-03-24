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
        // We trigger a small fetch for each section to "warm up" the API/Cache
        // This ensures that when the Home page shows, the data is already there.
        const sections = [
          "https://api.rawg.io/api/games?page_size=1&key=" + apiKey, // Recommended warmup
          "https://api.rawg.io/api/games?page_size=1&ordering=-rating&key=" + apiKey, // Trending warmup
          "https://api.rawg.io/api/games?page_size=1&tags=free-to-play&key=" + apiKey // Free warmup
        ];

        // ✅ Wait for all API handshakes to finish
        await Promise.all(sections.map(url => fetch(url)));

        // Give a tiny 500ms extra buffer for the images to start rendering
        setTimeout(() => {
          setAppLoading(false); 
        }, 500);

      } catch (error) {
        console.error("API Error:", error);
        setAppLoading(false); // Hide loader anyway so the user isn't stuck
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