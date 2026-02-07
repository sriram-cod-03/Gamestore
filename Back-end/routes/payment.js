// routes/payment.js
const express = require("express");
const router = express.Router();

// test route
router.get("/test", (req, res) => {
  res.json({ message: "Payment route working ✅" });
});

// checkout route (dummy)
router.post("/checkout", (req, res) => {
  res.json({ message: "Checkout success (dummy)" });
});

module.exports = router;
