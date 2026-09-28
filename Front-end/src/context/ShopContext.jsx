import React, { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Load initial state from localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("gs_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("gs_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState([]);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("gs_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("gs_cart", JSON.stringify(cart));
  }, [cart]);

  // Helper function to trigger Toast Notifications
  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // --- FAVORITE HANDLERS ---
  const toggleFavorite = (game) => {
    const isFav = favorites.some((item) => item.id === game.id);
    if (isFav) {
      setFavorites((prev) => prev.filter((item) => item.id !== game.id));
      showNotification(`Removed "${game.name}" from Favorites`, "info");
    } else {
      setFavorites((prev) => [...prev, game]);
      showNotification(`Added "${game.name}" to Favorites ❤️`, "success");
    }
  };

  const isFavorite = (gameId) => {
    return favorites.some((item) => item.id === gameId);
  };

  // --- CART HANDLERS ---
  const addToCart = (game) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === game.id);
      if (existing) {
        showNotification(`Updated quantity for "${game.name}" in Cart 🛒`, "success");
        return prev.map((item) =>
          item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showNotification(`Added "${game.name}" to Cart 🛒`, "success");
      return [...prev, { ...game, quantity: 1 }];
    });
  };

  const removeFromCart = (gameId) => {
    const game = cart.find((item) => item.id === gameId);
    setCart((prev) => prev.filter((item) => item.id !== gameId));
    if (game) {
      showNotification(`Removed "${game.name}" from Cart`, "info");
    }
  };

  const updateCartQuantity = (gameId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === gameId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const getCartCount = () => cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        favorites,
        cart,
        toasts,
        toggleFavorite,
        isFavorite,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCartCount,
        showNotification
      }}
    >
      {children}
      {/* Toast Render */}
      <div className="gs-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`gs-toast gs-toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};