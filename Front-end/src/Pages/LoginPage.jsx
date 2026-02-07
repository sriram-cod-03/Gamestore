import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import loginBg from "../assets/images/LoginBGimage.jpg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/login`,
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      alert("✅ Login successful!");

      // ✅ Always go to dashboard after login
      navigate("/dashboard", { replace: true });

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

          <div className="col-12 mb-4">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="col-12 mb-4">
            <label>Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <button
              onClick={handleLogin}
              className="btn btn-outline-danger"
              style={{ width: "120px" }}
            >
              Login
            </button>
          </div>

          <p className="mt-3 text-center">Don't have an account?</p>
          <Link to="/signup" className="btn btn-link text-white">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
