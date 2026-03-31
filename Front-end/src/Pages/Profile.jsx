import React, { useState, useEffect } from "react";
import { FaCamera, FaSave, FaUserEdit } from "react-icons/fa";
import "../styles/profile.css";

const Profile = () => {
  // 1. STATE: Check if profile data already exists in localStorage
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    gender: "",
    avatar: null
  });

  // 2. LOAD DATA: On refresh, check if we have saved data
  useEffect(() => {
    const savedData = localStorage.getItem("userProfile");
    if (savedData) {
      setProfile(JSON.parse(savedData));
      setIsSubmitted(true); // If data exists, show the "Display" view
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
    }
  };

  // 3. SAVE DATA: Save to local storage and switch view
  const handleSave = (e) => {
    e.preventDefault();
    if (!profile.name || !profile.username) {
      alert("Please enter at least your Name and Username!");
      return;
    }
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setIsSubmitted(true);
  };

  return (
    <div className="profile-wrapper container">
      {!isSubmitted ? (
        /* --- VIEW 1: THE INPUT FORM (Shows when empty) --- */
        <div className="profile-glass-card">
          <h2 className="setup-title">Setup Your Profile</h2>
          <form className="profile-form" onSubmit={handleSave}>
            <div className="avatar-upload">
              <label className="avatar-frame">
                {profile.avatar ? <img src={profile.avatar} alt="Preview" /> : <span>+</span>}
                <input type="file" onChange={handleImageChange} hidden />
              </label>
              <p>Upload Avatar</p>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Ex: Sriram R" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input type="text" name="username" placeholder="Ex: srx._03" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea name="bio" placeholder="Tell us about your gaming life..." onChange={handleChange} rows="3" />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button type="submit" className="btn-save"><FaSave /> Save Profile</button>
          </form>
        </div>
      ) : (
        /* --- VIEW 2: THE DISPLAY CARD (Shows after saving) --- */
        <div className="profile-glass-card">
          <div className="avatar-container">
            <div className="avatar-frame">
              {profile.avatar ? (
                <img src={profile.avatar} alt="User" className="user-avatar" />
              ) : (
                <div className="avatar-placeholder">{profile.name.charAt(0)}</div>
              )}
            </div>
          </div>

          <div className="display-info">
            <h2 className="display-name">{profile.name}</h2>
            <p className="display-username">@{profile.username}</p>
            <div className="divider"></div>
            <p className="display-bio">"{profile.bio}"</p>
            <p className="display-gender"><strong>GENDER:</strong> {profile.gender}</p>
          </div>

          <button className="btn-edit" onClick={() => setIsSubmitted(false)}>
            <FaUserEdit /> Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;