const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// POST /api/trip → 注册新旅程
router.post('/', async (req, res) => {
    try {
      const driver = req.body.driverName;
      const newStart = new Date(req.body.startTime);
      const newEnd = new Date(req.body.endTime);
  
      // ✅ 安全校验：开始时间必须早于结束时间
      if (newStart >= newEnd) {
        return res.status(400).json({ error: 'Hora de início deve ser anterior à de fim.' });
      }
  
      // ✅ 查重：不能重叠已有 trip
      const overlap = await Trip.findOne({
        driverName: driver,
        $or: [
          { startTime: { $lt: newEnd }, endTime: { $gt: newStart } }
        ]
      });
      if (overlap) {
        return res.status(400).json({ error: 'Já existe uma viagem neste horário.' });
      }
  
      // ✅ 获取该司机已有 trip 数量 → 生成 sequenceNumber
      const tripCount = await Trip.countDocuments({ driverName: driver });
      const sequence = tripCount + 1;
  
      const newTrip = new Trip({
        ...req.body,
        sequenceNumber: sequence
      });
  
      await newTrip.save();
      res.status(201).json(newTrip);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// GET /api/trip → 获取所有 trip 记录
router.get('/', async (req, res) => {
    try {
      const driver = req.query.driverName;
  
      const filter = driver ? { driverName: driver } : {};
      const trips = await Trip.find(filter);
      res.json(trips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
