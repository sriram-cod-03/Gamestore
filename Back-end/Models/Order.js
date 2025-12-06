// Models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    gameTitle:       { type: String, required: true },  // e.g. "Grand Theft Auto V"
    gamePrice:       { type: Number, required: true },
    platformSupport: { type: Number, required: true },
    totalAmount:     { type: Number, required: true },

    email:      { type: String, required: true },
    nameOnCard: { type: String, required: true },

    // we never store full card / cvv
    cardLast4: { type: String, required: true },

    paymentStatus: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
