import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/profile.css";

const Profile = () => {
  // --- 1. STATE & REFERENCES ---
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // Reference for the hidden file selector

  // Form State for editing text fields
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    gender: ""
  });

  // --- 2. LOAD DATA ON START ---
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setFormData({
        username: savedUser.username || "",
        bio: savedUser.bio || "Gaming is not a hobby, it's life Style",
        gender: savedUser.gender || "Male"
      });
    }
  }, []);

  // --- 3. PHOTO UPLOAD LOGIC ---
  const handleAvatarClick = () => {
    fileInputRef.current.click(); // Triggers the hidden input[type="file"]
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      
      // Instant Preview on UI
      setUser((prev) => ({ ...prev, profilePic: base64Image }));

      // Save Photo to Database immediately
      try {
        const response = await axios.put("http://localhost:5000/api/users/update-profile", {
          userId: user._id,
          profilePic: base64Image
        });

        if (response.data.success) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          console.log("Photo synced to MongoDB ✅");
        }
      } catch (err) {
        alert("Photo upload failed. Check server connection.");
      }
    };
    reader.readAsDataURL(file);
  };

  // --- 4. TEXT UPDATE LOGIC ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.put("http://localhost:5000/api/users/update-profile", {
        userId: user._id,
        username: formData.username,
        bio: formData.bio,
        gender: formData.gender
      });

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        setIsEditing(false);
        alert("Profile Updated Successfully! 🚀");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-glass-card">
        
        {/* --- AVATAR SECTION --- */}
        <div className="profile-header">
          <div className="avatar-wrapper" onClick={handleAvatarClick} title="Click to change photo">
            {user.profilePic ? (
              <img src={user.profilePic} alt="Avatar" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">USER</div>
            )}
            <div className="avatar-overlay">EDIT</div>
          </div>
          
          {/* HIDDEN FILE INPUT */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: "none" }} 
          />

          <h1 className="profile-display-name">{user.firstName} {user.lastName}</h1>
          <p className="profile-display-handle">@{user.username || "new_player"}</p>
        </div>

        {/* --- BODY SECTION --- */}
        <div className="profile-content">
          {isEditing ? (
            <div className="edit-mode-form">
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  className="glass-field" 
                  value={formData.username} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea 
                  name="bio" 
                  className="glass-field bio-area" 
                  value={formData.bio} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select 
                  name="gender" 
                  className="glass-field" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Secret">Secret</option>
                </select>
              </div>
              <div className="action-row">
                <button className="save-btn" onClick={handleSaveProfile} disabled={loading}>
                  {loading ? "SAVING..." : "SAVE CHANGES"}
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>CANCEL</button>
              </div>
            </div>
          ) : (
            <div className="view-mode-details">
              <div className="detail-block">
                <h4>BIO</h4>
                <p>"{user.bio || "No bio available."}"</p>
              </div>
              <div className="stats-grid">
                <div className="stat-box">
                  <small>GENDER</small>
                  <span>{user.gender || "Male"}</span>
                </div>
                <div className="stat-box">
                  <small>EMAIL</small>
                  <span>{user.email}</span>
                </div>
              </div>
              <button className="enter-edit-btn" onClick={() => setIsEditing(true)}>
                EDIT PROFILE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;