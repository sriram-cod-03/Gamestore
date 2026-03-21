import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import PageNotFound from "./Components/PageNotFound";
import PaymentPage from "./Components/PaymentPage";
import GamesCategory from "./Components/GamesCategory";

// Pages
import Home from "./Pages/Home";
import LoginPage from "./Pages/LoginPage";
import SignUp from "./Pages/SignUp";
import SearchResults from "./Pages/SearchResults";
import GameDetails from "./Pages/GameDetails";

function App() {
  const location = useLocation();

  // 🔥 Pages where Navbar & Footer should NOT appear (Login and Signup)
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="app-wrapper">
      {/* ✅ Navbar: hidden on login & signup */}
      {!hideLayout && <Navbar />}

      {/* The <main> tag is the "Stable" container. 
          It pushes the footer to the bottom even if the page is empty. 
      */}
      <main className="main-content">
        <Routes>
          {/* HOME ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />

          {/* AUTH ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />

          {/* SEARCH ROUTES */}
          <Route path="/search/:query" element={<SearchResults />} />

          {/* GAME DETAILS */}
          <Route path="/game/:id" element={<GameDetails />} />

          {/* PAYMENT */}
          <Route path="/payment/:id" element={<PaymentPage />} />

          {/* CATEGORY ROUTES (e.g., /games/playstation) */}
          <Route path="/games/:category" element={<GamesCategory />} />

          {/* 404 CATCH-ALL */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      {/* ✅ Footer: hidden on login & signup */}
      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;