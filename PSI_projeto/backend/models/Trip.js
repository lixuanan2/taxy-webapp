// user story 8
// 记录一次司机带客户的旅程，包括司机信息、时间、地点、费用等。
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  driverNIF: { type: String, required: true },  
  driverName: { type: String, required: true },
  clientNIF: { type: String, required: true },
  vehiclePlate: { type: String, required: true }, 

  from: { type: String, required: true },        // 起点地址（简化为文字）
  to: { type: String, required: true },          // 终点地址（简化为文字）
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  price: { type: Number, required: true },
  peopleCount: { type: Number, required: true },
  sequenceNumber: { type: Number, required: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },

  createdAt: { type: Date, default: Date.now },

  fromLat: Number,
  fromLon: Number,

  toLat: Number,
  toLon: Number,

  kmTraveled: Number,
});

module.exports = mongoose.model('Trip', tripSchema);
