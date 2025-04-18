// models/rideRequest.model.js
const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
  nif: { type: String, required: true },
  currentLocation: { type: String, required: true },
  destination: { type: String, required: true },
  peopleCount: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending | accepted | cancelled | rejected
  driverId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RideRequest', rideRequestSchema);
