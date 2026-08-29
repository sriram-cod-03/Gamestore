import React, { createContext, useContext, useState, useCallback } from "react";
import "../styles/notification.css";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Trigger function supporting title, custom message, and notification types
  const showToast = useCallback((message, type = "success", title = null, duration = 5000) => {
    const id = Date.now();
    const defaultTitle = 
      type === "error" ? "SECURITY ALERT" : 
      type === "info" ? "SYSTEM NOTICE" : 
      "ARENA EVENT";

    const newToast = {
      id,
      title: title || defaultTitle,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}

      {/* Global Glass Portal Container */}
      <div className="liquid-toast-portal">
        {toasts.map((toast) => (
          <div key={toast.id} className={`liquid-glass-card type-${toast.type}`}>
            {/* Ambient Background Gradient Reflections */}
            <div className="ambient-orb orb-pink"></div>
            <div className="ambient-orb orb-blue"></div>

            {/* Header Row */}
            <div className="liquid-card-header">
              <div className="liquid-pill">
                <span className="pill-top">{toast.type.toUpperCase()}</span>
                <span className="pill-bot">LIVE</span>
              </div>
              <span className="liquid-header-title">{toast.title}</span>
              <button className="liquid-close-btn" onClick={() => removeToast(toast.id)}>
                ✕
              </button>
            </div>

            <div className="liquid-divider"></div>

            {/* Core Body */}
            <div className="liquid-card-body">
              <div className={`liquid-accent-bar accent-${toast.type}`}></div>
              <div className="liquid-text-block">
                <div className="liquid-title-row">
                  <h4 className="liquid-main-text">
                    {toast.type === "success" && "Success Confirmed"}
                    {toast.type === "error" && "Action Denied"}
                    {toast.type === "info" && "Notice Available"}
                  </h4>
                  <span className="liquid-timestamp">{toast.time}</span>
                </div>
                <p className="liquid-sub-message">{toast.message}</p>
              </div>
            </div>

            {/* Profile Avatar Group Footer */}
            <div className="liquid-footer">
              <div className="avatar-cluster">
                <div className="avatar-chip user-chip">🎮</div>
                <div className="avatar-chip accent-chip">⚡</div>
              </div>
              <span className="network-tag">Synced • GameStore Engine</span>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);