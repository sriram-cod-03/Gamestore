import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) return;

    setBtnLoading(true);

    setTimeout(() => {
      localStorage.setItem("token", "dummy-token");
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="login-screen">
      <div className="login-bg-overlay"></div>

      <div className="login-glass-card">
        <h2>Welcome to The GameStore</h2>
        <p className="login-subtitle">Login to continue</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 🔥 PASSWORD WITH SHOW / HIDE */}
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button type="submit" className="login-btn" disabled={btnLoading}>
            {btnLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
