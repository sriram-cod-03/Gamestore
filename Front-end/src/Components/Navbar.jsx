import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlaystation, FaXbox, FaGamepad, FaChevronDown } from "react-icons/fa";
import logo from "../assets/images/GameStoreicon.png";
import "../styles/navbar.css";

const PLATFORM_MENUS = [
  {
    name: "PlayStation",
    icon: <FaPlaystation className="platform-icon ps-icon" />,
    items: [
      { label: "PS5 Games", platformId: 187 },
      { label: "PS4 Games", platformId: 18 },
      { label: "PS3 Games", platformId: 16 }
    ]
  },
  {
    name: "Xbox",
    icon: <FaXbox className="platform-icon xbox-icon" />,
    items: [
      { label: "Xbox Series Games", platformId: 186 },
      { label: "Xbox One Games", platformId: 1 },
      { label: "Xbox 360 Games", platformId: 14 }
    ]
  },
  {
    name: "Nintendo",
    icon: <FaGamepad className="platform-icon nintendo-icon" />,
    items: [
      { label: "Nintendo Switch Games", platformId: 7 }
    ]
  }
];

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Click outside close handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search/${encodeURIComponent(search.trim())}`);
    setSearch("");
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleCategorySelect = (item) => {
    setActiveDropdown(null);
    navigate(`/platform/${item.platformId}?title=${encodeURIComponent(item.label)}`);
  };

  return (
    <header className="gs-navbar-root" ref={dropdownRef}>
      {/* 1. TOP NAVBAR */}
      <div className="gs-navbar">
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

          {/* SEARCH BAR */}
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
      </div>

      {/* 2. CATEGORY DROPDOWNS BAR */}
      <div className="gs-subnav-bar">
        <div className="gs-container gs-subnav-container">
          <div className="gs-dropdowns-group">
            {PLATFORM_MENUS.map((platform) => {
              const isOpen = activeDropdown === platform.name;
              return (
                <div key={platform.name} className="gs-dropdown-wrap">
                  <button
                    type="button"
                    className={`gs-dropdown-trigger ${isOpen ? "active" : ""}`}
                    onClick={() => toggleDropdown(platform.name)}
                  >
                    {platform.icon}
                    <span>{platform.name}</span>
                    <FaChevronDown className={`arrow-icon ${isOpen ? "rotate" : ""}`} />
                  </button>

                  {/* POPUP MENU */}
                  {isOpen && (
                    <ul className="gs-dropdown-menu">
                      {platform.items.map((sub) => (
                        <li key={sub.platformId}>
                          <button
                            type="button"
                            className="gs-dropdown-item-btn"
                            onClick={() => handleCategorySelect(sub)}
                          >
                            {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="subnav-tagline">
            <span>OFFICIAL CONSOLE EDITIONS</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;