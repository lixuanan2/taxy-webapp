// user story 2
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  number: String,
  postalCode: String,
  city: String
}, { _id: false });

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  birthYear: { type: Number, required: true },
  nif: { type: String, required: true, unique: true },
  licenseNumber: { type: String, required: true, unique: true },
  address: { type: addressSchema, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Driver', driverSchema);
