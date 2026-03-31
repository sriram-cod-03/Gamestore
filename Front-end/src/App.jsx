import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Components & Pages
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import PageNotFound from "./Components/PageNotFound";
import PaymentPage from "./Components/PaymentPage";
import GamesCategory from "./Components/GamesCategory";
import Preloader from "./Components/Preloader";
import Home from "./Pages/Home";
import LoginPage from "./Pages/LoginPage";
import SignUp from "./Pages/SignUp";
import SearchResults from "./Pages/SearchResults";
import GameDetails from "./Pages/GameDetails";
import BrowsePage from "./Pages/Browse";
import NewReleases from "./Pages/NewReleases"; // ✅ IMPORTED THIS
import Profile from "./Pages/Profile";

import "./App.css";

// --- ✅ PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="app-wrapper fade-in">
      {!hideLayout && <Navbar />}

      {/* Main content with flex grow to push footer down */}
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home setAppLoading={setIsLoading} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home setAppLoading={setIsLoading} />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Store Routes */}
          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <BrowsePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/:id"
            element={
              <ProtectedRoute>
                <GameDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search/:query"
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ FIXED: Specific route for New Releases */}
          <Route
            path="/games/new"
            element={
              <ProtectedRoute>
                <NewReleases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/:category"
            element={
              <ProtectedRoute>
                <GamesCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
