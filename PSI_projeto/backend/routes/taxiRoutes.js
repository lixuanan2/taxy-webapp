const express = require('express');     // express路由模块
const router = express.Router();
const Taxi = require('../models/taxi');

// POST: 添加一个新的taxi
router.post('/', async (req, res) => {
  try {
    const newTaxi = new Taxi(req.body);       // 创建一个新的taxi实例
    const savedTaxi = await newTaxi.save();   // 保存至MongoDB
    res.status(201).json(savedTaxi);          // 返回新创建的对象
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Duplicate plate', error: err.message });
    } else {
      res.status(500).json({ message: 'Error creating taxi', error: err.message });
    }
  }
});

// GET: 列出所有的taxi
router.get('/', async (req, res) => {
  try {
    // Taxi.find()对应(SELECT * FROM taxi)
    const taxis = await Taxi.find().sort({ createdAt: -1 }); // 最近的排在最前
    res.json(taxis);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching taxis' });
  }
});

module.exports = router;
