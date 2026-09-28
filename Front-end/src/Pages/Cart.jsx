import React from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import "../styles/cart.css";

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity } = useShop();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page-root">
      <div className="cart-container">
        {/* HEADER */}
        <div className="cart-header">
          <span className="cart-badge">SHOPPING BAG</span>
          <h1 className="cart-title">Your Cart 🛒</h1>
        </div>

        {cart.length === 0 ? (
          /* EMPTY STATE */
          <div className="cart-empty-wrap">
            <FaShoppingCart className="cart-empty-icon" />
            <h3>Your cart is empty</h3>
            <p style={{ color: "#888899", margin: "8px 0 24px" }}>
              Looks like you haven't added any games to your cart yet.
            </p>
            <Link to="/browse" className="checkout-btn" style={{ textDecoration: "none", display: "inline-block", width: "auto", padding: "12px 28px" }}>
              Explore Games
            </Link>
          </div>
        ) : (
          /* MAIN LAYOUT */
          <div className="cart-layout">
            {/* ITEMS LIST */}
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-left">
                    <img
                      src={
                        item.background_image ||
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={item.name}
                      className="cart-item-img"
                    />
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <span className="cart-item-price">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    {/* QUANTITY CONTROLS */}
                    <div className="cart-qty-control">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateCartQuantity(item.id, -1)}
                      >
                        <FaMinus />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateCartQuantity(item.id, 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>

                    {/* REMOVE BUTTON */}
                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY CARD */}
            <div className="cart-summary-card">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-row">
                <span>Items Count</span>
                <span>{cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
              </div>
              <div className="summary-row">
                <span>Platform Fee</span>
                <span style={{ color: "#00ff88" }}>FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span className="summary-total-price">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              <button type="button" className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;