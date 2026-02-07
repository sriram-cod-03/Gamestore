import React from "react";
import GameCarouselCard from "../Components/GameCarouselCard";
import RecommendedGameCards from "../Components/RecommendedCard";
import TrendingGameCard from "../Components/TrendingCard";
import FreeGameCard from "../Components/Freecard";
import HorrorCard from "../Components/HorrorCard";


const Home = () => {
  return (
    <div className=" mt-3">
      <GameCarouselCard />
      {/* RGC */}
      <div className="mt-5">
      
        <RecommendedGameCards />
      </div>
      {/* TGC */}
      <div className="mt-5">
       
       <TrendingGameCard/>
      </div>
      {/* FGC */}
        <div className="mt-5">
       <FreeGameCard/>
      </div>
      {/* HGC */}
      <div className="mt-5">
      <HorrorCard/>
      </div>
      {/* footer */}
      <div>
        
      </div>
    </div>
         
  );
};

export default Home;
