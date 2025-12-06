import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import loginBg from "../assets/images/LoginBGimage.jpg";

// ✅ read backend url from .env
// .env file: VITE_API_BASE_URL=https://gamestore-backend-paqz.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // redirect after login

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/login`, // ✅ use env URL
        { email, password }
      );

      // save token
      localStorage.setItem("token", res.data.token);

      alert("✅ Login successful!");

      // go back to previous route or homepage
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      let msg = "Login failed";

      if (err.response?.data?.error) {
        msg = err.response.data.error;
      } else if (!err.response) {
        msg = "❌ Cannot reach server (Backend down?)";
      }

      alert(msg);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card shadow-lg"
        style={{
          width: "500px",
          borderRadius: "15px",
          backgroundColor: "transparent",
        }}
      >
        <div className="card-body text-white row">
          <h4 className="mb-2">Welcome to The GameStore</h4>

          {/* Email */}
          <div className="col-12 mb-4">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="col-12 mb-4">
            <label className="form-label">Password</label>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              className="btn btn-outline-danger"
              style={{ width: "120px" }}
            >
              Login
            </button>
          </div>
          {/* Redirect to Signup */}
          <p className="mt-3 text-center">Don't have an account?</p>

          <Link
            to="/signup"
            className="btn btn-link"
            style={{ color: "white" }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
