import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Added Axios
import "../styles/signup.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", mobile: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", form);
      if (res.data.success) {
        alert("Signup Success! Redirecting to Login...");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-screen">
      <div className="signup-overlay"></div>
      <div className="signup-glass-card">
        <h2>Welcome to The GameStore</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input type="text" name="firstName" placeholder="First name" onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last name" onChange={handleChange} required />
          </div>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <div className="password-box">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required />
            <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</span>
          </div>
          <input type="tel" name="mobile" placeholder="Mobile number" onChange={handleChange} required />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p className="login-text">Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
      </div>
    </div>
  );
};

export default SignUp;