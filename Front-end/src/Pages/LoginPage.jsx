import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

const LoginPage = () => {
  // --- 1. STATE MANAGEMENT ---
  const [identifier, setIdentifier] = useState(""); // Holds Email, Username, or Mobile
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false); // Toggles between Login and Forgot Password

  const navigate = useNavigate();

  // --- 2. LOGIN / RECOVERY LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    
    // Choose the API endpoint based on the current mode
    const endpoint = isRecoveryMode 
      ? "http://localhost:5000/api/users/quick-access" 
      : "http://localhost:5000/api/users/login";

    // Prepare the data to send to the Backend
    // Both modes now send 'identifier' so the backend can use the $or search logic
    const payload = isRecoveryMode 
      ? { identifier } 
      : { identifier, password }; 

    try {
      const response = await axios.post(endpoint, payload);
      
      if (response.data.success) {
        // Save the secure token and user details to the browser's storage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Success! Move to the Home page
        navigate("/home"); 
      }
    } catch (err) {
      // If the server is offline or the ID is wrong, show the error
      const errorMsg = err.response?.data?.error || "Access Denied. Please check your credentials.";
      alert(errorMsg);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-bg-overlay"></div>
      <div className="login-glass-card">
        <h2 className="brand-title">The GameStore</h2>
        <p className="login-subtitle">
          {isRecoveryMode ? "Quick Recovery Access" : "Enter your credentials to access the arena"}
        </p>

        <form onSubmit={handleLogin}>
          {/* IDENTIFIER INPUT (Email, Username, or Mobile) */}
          <div className="input-group">
            <label className="input-label">
              {isRecoveryMode ? "Email / Username / Mobile" : "Email Address / Username / Mobile"}
            </label>
            <input 
              type="text" 
              className="glass-input"
              placeholder={isRecoveryMode ? "Enter any ID..." : "Ex: praveen0372 or 9876543210"} 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              required
            />
          </div>
          
          {/* PASSWORD FIELD - Hidden when in Recovery Mode */}
          {!isRecoveryMode && (
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="glass-input"
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "HIDE" : "SHOW"}
                </span>
              </div>
            </div>
          )}

          {/* ACTION BUTTON */}
          <button type="submit" className="login-btn" disabled={btnLoading}>
            {btnLoading ? "Processing..." : isRecoveryMode ? "Recover Access" : "Login"}
          </button>
          
          {/* TOGGLE LINK - Switches between Login and Recovery */}
          <div className="forgot-container-center">
            <span className="forgot-link" onClick={() => setIsRecoveryMode(!isRecoveryMode)}>
              {isRecoveryMode ? "← Back to Login" : "Forgot Password?"}
            </span>
          </div>

          {/* SIGNUP LINK */}
          <p className="signup-text">
            New player? <span onClick={() => navigate("/signup")} className="create-account-link">Create Account</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;