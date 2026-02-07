import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // scroll down → hide footer
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowFooter(false);
      }
      // scroll up → show footer
      else {
        setShowFooter(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <footer className={`app-footer ${showFooter ? "show" : "hide"}`}>
      <div className="footer-card">
        <h5 className="footer-heading">Games</h5>

        <ul className="footer-links">
          <li>
            <Link to="/games/playstation">PlayStation</Link>
          </li>
          <li>
            <Link to="/games/xbox">Xbox</Link>
          </li>
          <li>
            <Link to="/games/nintendo">Nintendo</Link>
          </li>
          <li>
            <Link to="/games/digital">Digital</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
