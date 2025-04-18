const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// POST: register new driver
router.post('/', async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0]; // 获取冲突字段（nif 或 licenseNumber）
      return res.status(400).json({ message: `${field} already exists` });
    }

    res.status(400).json({ message: 'Failed to create driver', error: err });
  }
});


// GET: list drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching drivers' });
  }
});

module.exports = router;
