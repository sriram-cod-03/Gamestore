import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/game-shop.png";
import "../styles/navbar.css";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search/${search.trim()}`);
    setSearch("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="gs-navbar">
      <div className="gs-container">
        {/* LOGO */}
        <Link to="/" className="gs-logo">
          <img src={logo} alt="Gamestore" />
          <span>GameStore</span>
        </Link>

        {/* NAV LINKS */}
        <nav className="gs-links">
          <Link to="/" className="gs-link">
            Home
          </Link>

          {!isLoggedIn ? (
            <Link to="/login" className="gs-link login">
              Login
            </Link>
          ) : (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>

        {/* SEARCH */}
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
