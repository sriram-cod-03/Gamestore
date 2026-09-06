import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/GameStoreicon.png";
import "../styles/navbar.css";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search/${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="gs-navbar">
      <div className="gs-container">
        {/* LOGO & BRANDING */}
        <Link to="/" className="gs-logo" title="GameStore Home">
          <img src={logo} alt="GameStore Logo" className="logo-img" />
          <span>GameStore</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="gs-links">
          <Link to="/" className="gs-link">Home</Link>
          <Link to="/browse" className="gs-link">Browse</Link>

          {!isLoggedIn ? (
            <Link to="/login" className="gs-link login-link">Login</Link>
          ) : (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>

        {/* SEARCH BAR (Wraps to second line on mobile/tablets cleanly) */}
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