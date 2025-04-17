// user story 5
const mongoose = require('mongoose');

const turnSchema = new mongoose.Schema({
  driverNif: { type: String, required: true },
  taxiPlate: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Turn', turnSchema);
