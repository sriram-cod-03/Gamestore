import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer align-items-end mt-5">
      <div>
        <div className="card bg-dark text-white shadow-lg">
          <div className="card-body">
            <div className="col">
              {/* OUR GAMES */}
              <div className="col-12">
                <h5 className="footer-heading text-warning mb-3">Games</h5>

                <ul className="list-unstyled d-flex gap-4 flex-wrap">
                  <li>
                    <Link
                      to="/games/playstation"
                      className="nav-link text-white"
                    >
                      PlayStation
                    </Link>
                  </li>
                  <li>
                    <Link to="/games/xbox" className="nav-link text-white">
                      Xbox
                    </Link>
                  </li>
                  <li>
                    <Link to="/games/nintendo" className="nav-link text-white">
                      Nintendo
                    </Link>
                  </li>
                  <li>
                    <Link to="/games/digital" className="nav-link text-white">
                      Digital
                    </Link>
                  </li>
                </ul>

              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

