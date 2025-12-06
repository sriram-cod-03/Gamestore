import React, { useState } from "react";
import axios from "axios";
import signupBg from "../assets/images/SignUpBGimage.jpg";

// ✅ Read backend URL from .env
// .env file: VITE_API_BASE_URL=https://gamestore-backend-paqz.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SignUp = () => {
  // form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // update state on input change
  const handleChange = (e) => {
    setErrorMsg("");
    setSuccessMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh

    try {
      // ✅ use Render backend instead of localhost
      const res = await axios.post(
        `${API_BASE_URL}/api/signup`,
        formData
      );

      setSuccessMsg(res.data.message || "Signup successful!");
      setErrorMsg("");

      // optional: clear form
      // setFormData({ firstName: "", lastName: "", email: "", password: "", mobile: "" });
    } catch (err) {
      console.error("Signup error:", err);

      let backendMsg = "";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          backendMsg = err.response.data;
        } else {
          backendMsg =
            err.response.data.message ||
            err.response.data.error ||
            "";
        }
      }

      if (!err.response) {
        setErrorMsg("Cannot reach server. Is backend running?");
      } else if (
        err.response.status === 409 ||
        backendMsg.toLowerCase().includes("already") ||
        backendMsg.toLowerCase().includes("exist")
      ) {
        setErrorMsg(
          backendMsg || "User already exists. Please login instead."
        );
      } else if (backendMsg) {
        setErrorMsg(backendMsg);
      } else {
        setErrorMsg("❌ Signup failed. Try again!");
      }

      setSuccessMsg("");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "120vh",
        display: "flex",
        backgroundImage: `url(${signupBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card mt-4 mb-4"
        style={{
          width: "500px",
          height: "580px",
          backgroundColor: "transparent",
          color: "white",
          borderRadius: "15px",
        }}
      >
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h4 className="text-center">Welcome To The Gamestore</h4>
            <h6 className="text-center">Sign Up your GameStore Account</h6>

            {errorMsg && (
              <p
                className="text-danger text-center mt-2"
                style={{ fontSize: "14px" }}
              >
                {errorMsg}
              </p>
            )}
            {successMsg && (
              <p
                className="text-success text-center mt-2"
                style={{ fontSize: "14px" }}
              >
                {successMsg}
              </p>
            )}

            <div className="mt-2">
              <h5>First Name</h5>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Your First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-2">
              <h5>Last Name</h5>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Your Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-2">
              <h5>Email Address</h5>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Your Email ID"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-2">
              <h5>Password</h5>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter Your Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
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

            <div className="mt-2">
              <h5>Mobile Number</h5>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Your Mobile Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-outline-dark mt-4"
                style={{ width: "200px" }}
              >
                SignUp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
