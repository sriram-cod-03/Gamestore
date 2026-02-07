import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

// Pages
import Home from "./Pages/Home";
import LoginPage from "./Pages/LoginPage";
import SignUp from "./Pages/SignUp";
import SearchResults from "./Pages/SearchResults";
import GameDetails from "./Pages/GameDetails";
import PageNotFound from "./Components/PageNotFound";

// Components / Pages
import PaymentPage from "./Components/PaymentPage";
import GamesCategory from "./Components/GamesCategory";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* HOME / DASHBOARD */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />

        {/* SEARCH */}
        <Route path="/searchresults" element={<SearchResults />} />

        {/* GAME DETAILS */}
        <Route path="/game/:id" element={<GameDetails />} />

        {/* PAYMENT */}
        <Route path="/payment/:id" element={<PaymentPage />} />

        {/* CATEGORY */}
        <Route path="/games/:category" element={<GamesCategory />} />

        {/* 404 FALLBACK */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;

