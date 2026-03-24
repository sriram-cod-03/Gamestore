import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", form);

    // Simulate signup success
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="signup-screen">
      <div className="signup-overlay"></div>

      <div className="signup-glass-card">
        <h2>Welcome to The GameStore</h2>
        <p className="subtitle">Create your GameStore account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
            <span className="toggle-text" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            placeholder="Enter mobile number"
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span className="link-text" onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;