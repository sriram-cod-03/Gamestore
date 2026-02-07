import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import signupBg from "../assets/images/SignUpBGimage.jpg";

// ✅ Backend base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SignUp = () => {
  const navigate = useNavigate();

  // form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // input handler
  const handleChange = (e) => {
    setErrorMsg("");
    setSuccessMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // signup submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, mobile } = formData;

    if (!firstName || !lastName || !email || !password || !mobile) {
      setErrorMsg("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/signup`, // ✅ CORRECT ROUTE
        {
          firstName,
          lastName,
          email: email.trim().toLowerCase(),
          password: password.trim(),
          mobile: mobile.trim(),
        }
      );

      setSuccessMsg(res.data.message || "Signup successful!");
      setErrorMsg("");

      // redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);

      let msg = "Signup failed";

      if (!err.response) {
        msg = "❌ Cannot reach server (backend may be sleeping)";
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.response?.status === 400) {
        msg = "User already exists. Please login.";
      }

      setErrorMsg(msg);
      setSuccessMsg("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${signupBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card shadow-lg"
        style={{
          width: "450px",
          borderRadius: "15px",
          backgroundColor: "rgba(0,0,0,0.65)",
          color: "white",
        }}
      >
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h4 className="text-center mb-2">
              Welcome to <b>The GameStore</b>
            </h4>
            <h6 className="text-center mb-3">
              Create your GameStore account
            </h6>

            {/* ERROR / SUCCESS */}
            {errorMsg && (
              <p className="text-danger text-center">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-success text-center">{successMsg}</p>
            )}

            {/* FIRST NAME */}
            <div className="mb-2">
              <label>First Name</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            {/* LAST NAME */}
            <div className="mb-2">
              <label>Last Name</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div className="mb-2">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-2">
              <label>Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* MOBILE */}
            <div className="mb-3">
              <label>Mobile Number</label>
              <input
                type="text"
                className="form-control"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="btn btn-outline-success w-100"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            {/* LOGIN LINK */}
            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-white">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
