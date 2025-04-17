const express = require('express');
const router = express.Router();
const Price = require('../models/Price');


// Post
router.post('/', async (req, res) => {
  try {
    const newPrice = new Price(req.body);
    const saved = await newPrice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/prices/latest - 获取最新的价格配置
router.get('/latest', async (req, res) => {
  try {
    const latest = await Price.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/prices/all - 获取所有历史价格配置
router.get('/all', async (req, res) => {
  try {
    const allPrices = await Price.find().sort({ createdAt: -1 });
    res.json(allPrices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;