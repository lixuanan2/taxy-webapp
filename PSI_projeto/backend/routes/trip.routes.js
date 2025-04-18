const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// POST /api/trip → 注册新旅程
router.post('/', async (req, res) => {
  try {
    const newTrip = new Trip(req.body);
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trip → 获取所有 trip 记录
router.get('/', async (req, res) => {
    try {
      const trips = await Trip.find();
      res.json(trips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;
