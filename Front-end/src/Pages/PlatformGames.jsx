import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/platformGames.css";

const RAWG_API_KEY = "10339595c43349fe932bbf361059223a";
const PAGE_SIZE = 15; // 3 rows of 5 cards = 15 cards per page

const PlatformGames = () => {
  const { platformId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get dynamic title from query param (e.g. ?title=PS4%20Games)
  const queryParams = new URLSearchParams(location.search);
  const pageTitle = queryParams.get("title") || "Console Games";

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Reset page to 1 whenever platform changes
    setPage(1);
  }, [platformId]);

  useEffect(() => {
    let isMounted = true;
    const fetchPlatformGames = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        const url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&platforms=${platformId}&page=${page}&page_size=${PAGE_SIZE}&ordering=-rating`;
        const res = await fetch(url);
        const data = await res.json();

        if (isMounted) {
          setGames(data.results || []);
          setTotalCount(data.count || 0);
        }
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPlatformGames();
    return () => {
      isMounted = false;
    };
  }, [platformId, page]);

  const totalPages = Math.min(Math.ceil(totalCount / PAGE_SIZE), 20);

  return (
    <div className="platform-page-root">
      <div className="platform-container">
        
        {/* HEADER TITLE */}
        <div className="platform-header">
          <div className="platform-badge">CATEGORY ARCHIVE</div>
          <h1 className="platform-title">
            {pageTitle.toUpperCase()} <span className="platform-glow-dot">.</span>
          </h1>
          <p className="platform-subtitle">
            Showing Page {page} of {totalPages || 1} • {PAGE_SIZE} Games / Page
          </p>
        </div>

        {/* LOADING SPINNER */}
        {loading ? (
          <div className="platform-loader-wrap">
            <div className="platform-spinner"></div>
            <p>Loading {pageTitle}...</p>
          </div>
        ) : (
          <>
            {/* 5-COLUMN GRID (Screenshot 4 format) */}
            <div className="platform-games-grid">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="game-catalog-card"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  <div className="card-thumb-wrap">
                    <img
                      src={
                        game.background_image ||
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={game.name}
                      className="card-thumb-img"
                      loading="lazy"
                    />
                    <span className="card-rating-badge">
                      <FaStar className="star" /> {game.rating || "4.0"}
                    </span>
                  </div>

                  <div className="card-meta">
                    <span className="card-release">
                      {game.released ? game.released.substring(0, 4) : "2024"}
                    </span>
                    <h3 className="card-title" title={game.name}>
                      {game.name}
                    </h3>
                    <div className="card-footer-row">
                      <span className="card-price">
                        ₹{(1299 + (game.id % 2000)).toLocaleString()}
                      </span>
                      <button className="card-view-btn">VIEW</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SCREENSHOT 4 STYLE PAGINATION */}
            <div className="platform-pagination">
              <button
                className="pag-nav-btn"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <FaChevronLeft /> Prev
              </button>

              <div className="pag-numbers">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      className={`pag-num-btn ${page === pNum ? "active" : ""}`}
                      onClick={() => setPage(pNum)}
                    >
                      {pNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="pag-dots">...</span>}
              </div>

              <button
                className="pag-nav-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next <FaChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlatformGames;