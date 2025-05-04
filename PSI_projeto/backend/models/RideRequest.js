// user story 6 7
const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
  nif: { type: String, required: true },
  gender: {type: String, required: true},
  currentLocation: { type: String, required: true },
  destination: { type: String, required: true },
  peopleCount: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending | accepted | cancelled | rejected
  driverNIF: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  currentLat: Number,
  currentLon: Number,
  destLat: Number,
  destLon: Number,
  confirmedByClient: { type: Boolean, default: false }
});

module.exports = mongoose.model('RideRequest', rideRequestSchema);
