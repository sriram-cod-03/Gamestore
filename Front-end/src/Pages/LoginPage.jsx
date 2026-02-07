import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginBg from "../assets/images/LoginBGimage.jpg";

// ✅ Backend base URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const navigate = useNavigate();

  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ If already logged in → go to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // ✅ LOGIN HANDLER
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/login`, // ✅ CORRECT ROUTE
        {
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }
      );

      // save token
      localStorage.setItem("token", res.data.token);

      alert("✅ Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      let msg = "Login failed";

      if (!err.response) {
        msg = "❌ Cannot reach server (backend may be sleeping)";
      } else if (err.response?.data?.error) {
        msg = err.response.data.error;
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card shadow-lg"
        style={{
          width: "420px",
          borderRadius: "15px",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "white",
        }}
      >
        <div className="card-body">
          <h4 className="text-center mb-3">
            Welcome to <b>The GameStore</b>
          </h4>

          {/* EMAIL */}
          <div className="mb-3">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label>Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
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

          {/* LOGIN BUTTON */}
          <button
            className="btn btn-outline-danger w-100"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* SIGNUP */}
          <p className="text-center mt-3">
            Don't have an account?
          </p>
          <Link to="/signup" className="btn btn-link text-white w-100">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
