/**
 * 📄 Trip Routes
 * 
 * 本文件定义旅程模块 (Trip) 相关的 REST API 接口，
 * 负责旅程(Trip)的登记、查询和获取详情等操作。
 * 
 * 对应数据库模型: Trip
 * 
 * 路由列表：
 * - POST   /api/trip         ➔ 注册新旅程（校验时间/防止重叠）
 * - GET    /api/trip         ➔ 查询所有旅程（可筛选 driverName / 时间段）
 * - GET    /api/trip/:id     ➔ 查询单条旅程详情
 */

// 📦 引入模块
const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

/* --------------------------------------------------
  🛫 注册新旅程
  POST /api/trip
-------------------------------------------------- */
router.post('/', async (req, res) => {
  try {
    const driver = req.body.driverName;
    const newStart = new Date(req.body.startTime);
    const newEnd = new Date(req.body.endTime);

    // ⏳ 校验起止时间
    if (newStart >= newEnd) {
      return res.status(400).json({ error: 'Start time must be earlier than end time.' });
    }

    // ❗️查重：检测是否已有重叠旅程
    const overlap = await Trip.findOne({
      driverName: driver,
      $or: [{ startTime: { $lt: newEnd }, endTime: { $gt: newStart } }]
    });
    if (overlap) {
      return res.status(400).json({ error: 'A trip already exists during this period.' });
    }

    // 🆙 获取旅程顺序号
    const tripCount = await Trip.countDocuments({ driverName: driver });
    const sequence = tripCount + 1;

    const newTrip = new Trip({
      ...req.body,
      sequenceNumber: sequence,
    });

    await newTrip.save();
    res.status(201).json(newTrip);

  } catch (err) {
    console.error('❌ Trip creation failed:', err);
    res.status(500).json({ error: err.message });
  }
});

/* --------------------------------------------------
  📋 获取所有 Trip 记录
  GET /api/trip
-------------------------------------------------- */
router.get('/', async (req, res) => {
  try {
    const { driverName, start, end } = req.query;
    const filter = {};

    if (driverName) filter.driverName = driverName;
    if (start && end) {
      filter.startTime = { $gte: new Date(start), $lte: new Date(end) };
    }

    const trips = await Trip.find(filter).sort({ startTime: -1 });
    res.json(trips);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --------------------------------------------------
  📄 获取单条 Trip 详情
  GET /api/trip/:id
-------------------------------------------------- */
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trip.', error: err.message });
  }
});

module.exports = router;
