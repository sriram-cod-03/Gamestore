// routes/payment.js
const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');

router.get('/test', (req, res) => {
  res.send('✅ Payment route working!');
});

router.post('/checkout', async (req, res) => {
  try {
    const {
      gameTitle,
      gamePrice,
      platformSupport,
      totalAmount,
      cardNumber,
      expiry,
      cvv,
      nameOnCard,
      email,
    } = req.body;

    if (!cardNumber || !expiry || !cvv || !nameOnCard || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 👉 Real payment gateway should come here (Stripe / Razorpay)
    const paymentSuccess = true;

    if (!paymentSuccess) {
      return res.status(402).json({ message: 'Payment failed ❌' });
    }

    const cardLast4 = cardNumber.toString().slice(-4);

    const order = new Order({
      gameTitle,
      gamePrice,
      platformSupport,
      totalAmount,
      email,
      nameOnCard,
      cardLast4,
      paymentStatus: 'SUCCESS',
    });

    await order.save();

    res.json({
      message: 'Payment successful ✅',
      orderId: order._id,
      last4: cardLast4,
      amount: totalAmount,
    });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ message: 'Server error processing payment ❌' });
  }
});

module.exports = router;
