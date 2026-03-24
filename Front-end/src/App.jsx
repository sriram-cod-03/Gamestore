import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import PageNotFound from "./Components/PageNotFound";
import PaymentPage from "./Components/PaymentPage";
import GamesCategory from "./Components/GamesCategory";
import Preloader from "./Components/Preloader"; // ✅ Import Preloader

// Pages
import Home from "./Pages/Home";
import LoginPage from "./Pages/LoginPage";
import SignUp from "./Pages/SignUp";
import SearchResults from "./Pages/SearchResults";
import GameDetails from "./Pages/GameDetails";

import "./App.css"; // Ensure your layout styles are here

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate a 2.5 second loading time
    // In a real app, you can stop loading once your game data fetch is finished
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Pages where Navbar & Footer should NOT appear
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  // ✅ 1. Show only the Preloader while loading
  if (isLoading) {
    return <Preloader />;
  }

  // ✅ 2. Show the main App once loading is finished
  return (
    <div className="app-wrapper fade-in">
      {!hideLayout && <Navbar />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          // Inside your App.jsx Routes:
          <Route path="/" element={<Home setAppLoading={setIsLoading} />} />
          <Route path="/home" element={<Home setAppLoading={setIsLoading} />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/games/:category" element={<GamesCategory />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
