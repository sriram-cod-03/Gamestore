import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/game-shop.png"; 

const Navbar = () => {
  const [GameSearch, setGameSearch] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (GameSearch.trim() !== "") {
      navigate(`/search/${GameSearch}`);
    }
  };

  // 🔹 LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("token");   // token delete
    // optional ah intha madhiri other user data irundha clear pannalaam
    // localStorage.removeItem("user");

    navigate("/login");                // login pagela anupu
  };

  return (
    <nav className="navbar bg-body-tertiary position-relative">
      <div className="container-fluid justify-content-center gap-5">
        <Link to="/" className="navbar-brand">
          <img
            src={logo}
            style={{ width: "30px", height: "30px" }}
            alt="logo"
          />
          Gamestore
        </Link>

        <Link to="/" className="nav-link active">
          Home
        </Link>

        {/* 🔹 If NOT logged in → show Login link */}
        {!isLoggedIn && (
          <Link to="/login" className="nav-link active">
            Login
          </Link>
        )}

        {/* 🔹 If logged in → show Logout button */}
        {isLoggedIn && (
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

        {/* Search Bar */}
        <div className="col-12 col-sm-6 col-md-8 col-lg-6 position-relative">
          <form className="d-flex" role="search" onSubmit={handleSubmit}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={GameSearch}
              onChange={(e) => setGameSearch(e.target.value)}
            />
            <button className="btn btn-outline-success btn-md" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
