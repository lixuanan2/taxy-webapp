const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  driverName: { type: String, required: true },
  clientNIF: { type: String, required: true },
  from: { type: String, required: true },        // 起点地址（简化为文字）
  to: { type: String, required: true },          // 终点地址（简化为文字）
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  price: { type: Number, required: true },
  vehiclePlate: { type: String },                // 可选，司机的车牌号
  peopleCount: { type: Number, required: true },
  sequenceNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', tripSchema);
