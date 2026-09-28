import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import GameCard from "../Components/GameCard";
import "../styles/platformGames.css";

const RAWG_API_KEY = "10339595c43349fe932bbf361059223a";
const PAGE_SIZE = 15; // 3 rows x 5 cards = 15 cards per page

const PlatformGames = () => {
  const { platformId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const pageTitle = queryParams.get("title") || "Console Games";

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
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

  const totalPages = Math.min(Math.ceil(totalCount / PAGE_SIZE), 20) || 1;

  // Dynamic pagination generator to handle sliding numbers
  const getPaginationItems = () => {
    const items = [];
    const delta = 2; // Number of pages to show before & after the active page

    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);

    // Always include page 1
    items.push(1);

    // Add ellipsis if there's a gap between 1 and start
    if (start > 2) {
      items.push("dots-left");
    }

    // Add surrounding pages
    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    // Add ellipsis if there's a gap between end and last page
    if (end < totalPages - 1) {
      items.push("dots-right");
    }

    // Always include last page if more than 1 page exists
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

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
            Showing Page {page} of {totalPages} • {PAGE_SIZE} Games / Page
          </p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="platform-loader-wrap">
            <div className="platform-spinner"></div>
            <p>Loading {pageTitle}...</p>
          </div>
        ) : (
          <>
            {/* 5-COLUMN GRID USING GAMECARD COMPONENT */}
            <div className="platform-games-grid">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {/* DYNAMIC SLIDING PAGINATION */}
            <div className="platform-pagination">
              <button
                className="pag-nav-btn"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <FaChevronLeft /> Prev
              </button>

              <div className="pag-numbers">
                {getPaginationItems().map((item, idx) => {
                  if (item === "dots-left" || item === "dots-right") {
                    return (
                      <span key={`dots-${idx}`} className="pag-dots">
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={item}
                      className={`pag-num-btn ${page === item ? "active" : ""}`}
                      onClick={() => setPage(item)}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              <button
                className="pag-nav-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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