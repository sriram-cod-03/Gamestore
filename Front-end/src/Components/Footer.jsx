import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaGithub, FaLinkedin, FaTwitter, FaChevronUp } from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="app-footer">
      <div className="footer-container">
        
        {/* TOP SECTION */}
        <div className="footer-header">
          <div className="footer-brand-section">
            <h2 className="footer-brand">gamestore</h2>
            <p className="footer-description">
              Your ultimate destination for the latest games, digital content, 
              and exclusive deals. Built for gamers.
            </p>
          </div>

          <div className="footer-grid">
            <div className="footer-column">
              <h6 className="column-title">Explore</h6>
              <ul className="column-list">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/games/new">New Releases</Link></li>
                <li><Link to="/profile">My Profile</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h6 className="column-title">Support</h6>
              <ul className="column-list">
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* BOTTOM SECTION */}
        <div className="footer-bottom">
          <p className="legal-notice">
            © 2026 <strong>Sriram R.</strong> All rights reserved.
          </p>
          <button className="back-to-top" onClick={scrollToTop}>
            Back to top <FaChevronUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;