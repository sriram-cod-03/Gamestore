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

  // 🔥 Pages where Navbar & Footer should NOT appear
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {/* ✅ Navbar hidden on login & signup */}
      {!hideLayout && <Navbar />}

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />

        {/* SEARCH */}
        <Route path="/search/:query" element={<SearchResults />} />

        {/* GAME DETAILS */}
        <Route path="/game/:id" element={<GameDetails />} />

        {/* PAYMENT */}
        <Route path="/payment/:id" element={<PaymentPage />} />

        {/* CATEGORY */}
        <Route path="/games/:category" element={<GamesCategory />} />

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {/* ✅ Footer hidden on login & signup */}
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
