// src/utils/auth.js
export const requireAuthAndNavigate = (navigate, targetPath) => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login", { state: { from: targetPath } });
  } else {
    navigate(targetPath);
  }
};
