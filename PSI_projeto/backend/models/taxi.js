// user story 1
const mongoose = require('mongoose');

const taxiSchema = new mongoose.Schema({
  plate: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  comfortLevel: { type: String, enum: ['basic', 'luxury'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Taxi', taxiSchema);
