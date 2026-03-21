import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Ensure this path matches your project structure
import logo from "../assets/images/favicon.png"; 
import "../styles/navbar.css";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Check if a token exists to determine if the user is logged in
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    // Redirects user to the search results page
    navigate(`/search/${search.trim()}`);
    setSearch("");
  };

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="gs-navbar">
      <div className="gs-container">
        
        {/* LOGO & BRANDING */}
        <Link to="/" className="gs-logo">
          <img src={logo} alt="GameStore Logo" className="logo-img" />
          <span>GameStore</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="gs-links">
          <Link to="/" className="gs-link">Home</Link>
          <Link to="/games/all" className="gs-link">Browse</Link>

          {!isLoggedIn ? (
            <Link to="/login" className="gs-link login-link">Login</Link>
          ) : (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>

        {/* SEARCH FUNCTIONALITY */}
        <form className="gs-search" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </header>
  );
};

export default Navbar;