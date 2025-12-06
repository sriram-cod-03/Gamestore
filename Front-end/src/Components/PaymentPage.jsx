import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [game, setGame] = useState(null);

  const [basePrice, setBasePrice] = useState(null);
  const [supportPrice, setSupportPrice] = useState(null);

  // ✅ Auth guard – if not logged in, go to login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [navigate, location.pathname]);

  // Game details fetch
  useEffect(() => {
    const fetchGame = async () => {
      const res = await fetch(
        `https://api.rawg.io/api/games/${id}?key=10339595c43349fe932bbf361059223a`
      );
      const data = await res.json();
      setGame(data);
    };
    fetchGame();
  }, [id]);

  // Random price generate + localStorage-la save (per game)
  useEffect(() => {
    if (!id) return;

    const saved = localStorage.getItem(`price_${id}`);

    if (saved) {
      const parsed = JSON.parse(saved);
      setBasePrice(parsed.base);
      setSupportPrice(parsed.support);
    } else {
      const randomBase =
        Math.floor(Math.random() * (2499 - 699 + 1)) + 699;
      const randomSupport =
        Math.floor(Math.random() * (399 - 99 + 1)) + 99;

      const toSave = { base: randomBase, support: randomSupport };

      localStorage.setItem(`price_${id}`, JSON.stringify(toSave));

      setBasePrice(randomBase);
      setSupportPrice(randomSupport);
    }
  }, [id]);

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#020617",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
    },
    card: {
      background: "#050814",
      padding: "24px",
      borderRadius: "20px",
      width: "90%",
      maxWidth: "900px",
      boxShadow: "0 20px 80px rgba(0,0,0,0.8)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    header: { display: "flex", gap: "20px", marginBottom: "20px" },
    image: { width: "160px", borderRadius: "12px" },
    title: { margin: 0 },
    subtitle: { color: "#9ca3af" },
    body: {
      display: "grid",
      gridTemplateColumns: "2fr 1.2fr",
      gap: "22px",
    },
    column: {},
    input: {
      width: "100%",
      marginBottom: "10px",
      padding: "8px",
      borderRadius: "8px",
      background: "#020617",
      border: "1px solid #4b5563",
      color: "#fff",
    },
    summary: {
      background: "linear-gradient(160deg,#1d4ed8,#020617)",
      borderRadius: "14px",
      padding: "16px",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "14px",
      marginBottom: "6px",
    },
    button: {
      width: "100%",
      marginTop: "14px",
      padding: "10px",
      borderRadius: "999px",
      border: "none",
      fontWeight: 700,
      cursor: "pointer",
      background: "linear-gradient(135deg,#facc15,#f97316)",
    },
  };

  if (!game || basePrice === null || supportPrice === null) {
    return (
      <p style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
        Loading...
      </p>
    );
  }

  const total = basePrice + supportPrice;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img
            src={game.background_image}
            alt={game.name}
            style={styles.image}
          />
          <div>
            <h2 style={styles.title}>{game.name}</h2>
            <p style={styles.subtitle}>Digital Purchase</p>
          </div>
        </div>

        <div style={styles.body}>
          {/* LEFT FORM */}
          <div style={styles.column}>
            <h3>Payment Details</h3>
            <input style={styles.input} placeholder="Card Number" />
            <input style={styles.input} placeholder="Expiry MM/YY" />
            <input style={styles.input} placeholder="CVV" />
            <input style={styles.input} placeholder="Name on Card" />
            <input style={styles.input} placeholder="Email" />
          </div>

          {/* RIGHT SUMMARY */}
          <div style={styles.summary}>
            <h3>Order Summary</h3>

            <div style={styles.row}>
              <span>Game Price</span>
              <span>₹{basePrice}</span>
            </div>

            <div style={styles.row}>
              <span>Platform Support</span>
              <span>₹{supportPrice}</span>
            </div>

            <hr />

            <div style={{ ...styles.row, fontWeight: "700" }}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              style={styles.button}
              onClick={() => alert(`Demo payment: ₹${total} 😄`)}
            >
              Pay ₹{total}
            </button>

            <button
              style={{
                ...styles.button,
                marginTop: "8px",
                background: "#334155",
                color: "#fff",
              }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
