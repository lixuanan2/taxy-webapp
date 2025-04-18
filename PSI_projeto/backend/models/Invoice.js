const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, unique: true }, // 每个旅程只能开一次发票
  clientNIF: { type: String, required: true },
  date: { type: Date, default: Date.now },
  total: { type: Number, required: true },
  sequenceNumber: { type: Number, required: true }, // 每个司机独立自增
  driverName: { type: String, required: true }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
