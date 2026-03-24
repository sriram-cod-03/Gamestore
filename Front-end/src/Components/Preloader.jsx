import React from "react";
import logo from "../assets/images/favicon.png";
import "../styles/preloader.css";

const Preloader = () => {
  return (
    <div className="preloader-wrapper">
      <div className="preloader-content">
        <img src={logo} alt="GameStore Logo" className="pulse-logo" />
        <div className="loading-bar-container">
          <div className="loading-bar-fill"></div>
        </div>
        <p>Loading Gamestore...</p>
      </div>
    </div>
  );
};

export default Preloader;