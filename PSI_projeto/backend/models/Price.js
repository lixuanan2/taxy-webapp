const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  basic: { type: Number, required: true },
  luxury: { type: Number, required: true },
  nightBonus: { type: Number, required: true },  // e.g. 20 代表 20%
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Price', priceSchema);
