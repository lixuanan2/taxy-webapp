const mongoose = require('mongoose');

// taxi在数据库中的结构(Schema)
// 除type之外, required和unique对应not_null和unique
const taxiSchema = new mongoose.Schema({
  plate: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  comfortLevel: { type: String, enum: ['basic', 'luxury'], required: true },
  createdAt: { type: Date, default: Date.now }
});

// 把taxiSchema编译(导出)成taxi.model
module.exports = mongoose.model('Taxi', taxiSchema);
