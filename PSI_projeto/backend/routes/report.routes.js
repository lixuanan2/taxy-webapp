// 📄 report.routes.js
// 📊 Report 统计模块：司机、出租车、客户、旅程统计

const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

/* --------------------------------------------------
  📈 总览统计
  GET /api/report/overview
-------------------------------------------------- */
router.get('/overview', async (req, res) => {
  try {
    const start = req.query.start ? new Date(req.query.start) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = req.query.end ? new Date(req.query.end) : new Date();
    end.setHours(23, 59, 59, 999);

    const trips = await Trip.find({ startTime: { $gte: start, $lte: end } });

    const totalTrips = trips.length;
    const totalHours = trips.reduce((sum, t) => sum + (new Date(t.endTime) - new Date(t.startTime)) / 3600000, 0);
    const totalKm = trips.reduce((sum, t) => sum + (t.kmTraveled || 0), 0);

    res.json({ totalTrips, totalHours, totalKm });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --------------------------------------------------
  🚗 按司机统计
  GET /api/report/drivers
-------------------------------------------------- */
router.get('/drivers', async (req, res) => {
  try {
    const start = new Date(req.query.start || new Date().setHours(0, 0, 0, 0));
    const end = new Date(req.query.end || new Date());

    const trips = await Trip.find({ startTime: { $gte: start, $lte: end } });

    const map = new Map();
    for (const t of trips) {
      const key = t.driverName;
      const hours = (new Date(t.endTime) - new Date(t.startTime)) / 3600000;
      const km = t.kmTraveled || 0;

      if (!map.has(key)) {
        map.set(key, { driverName: key, hours: 0, km: 0 });
      }
      const d = map.get(key);
      d.hours += hours;
      d.km += km;
    }

    res.json(Array.from(map.values()).sort((a, b) => b.hours - a.hours));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --------------------------------------------------
  🚖 按出租车统计
  GET /api/report/taxis
-------------------------------------------------- */
router.get('/taxis', async (req, res) => {
  try {
    const start = new Date(req.query.start || new Date().setHours(0, 0, 0, 0));
    const end = new Date(req.query.end || new Date());

    const trips = await Trip.find({
      startTime: { $gte: start, $lte: end },
      vehiclePlate: { $ne: '' }
    });

    const map = new Map();
    for (const t of trips) {
      const key = t.vehiclePlate;
      const hours = (new Date(t.endTime) - new Date(t.startTime)) / 3600000;
      const km = t.kmTraveled || 0;

      if (!map.has(key)) {
        map.set(key, { vehiclePlate: key, hours: 0, km: 0 });
      }
      const d = map.get(key);
      d.hours += hours;
      d.km += km;
    }

    res.json(Array.from(map.values()).sort((a, b) => b.hours - a.hours));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --------------------------------------------------
  📈 客户总支付金额
  GET /api/report/customers
-------------------------------------------------- */
router.get('/customers', async (req, res) => {
  try {
    const start = new Date(req.query.start || new Date().setHours(0, 0, 0, 0));
    const end = new Date(req.query.end || new Date());
    end.setHours(23, 59, 59, 999);

    const trips = await Trip.find({ startTime: { $gte: start, $lte: end } });

    const map = new Map();
    for (const t of trips) {
      const key = t.clientNIF;
      const value = t.price;

      if (!map.has(key)) {
        map.set(key, { clientNIF: key, totalPaid: 0, tripCount: 0 });
      }
      const c = map.get(key);
      c.totalPaid += value;
      c.tripCount += 1;
    }

    res.json(Array.from(map.values()).sort((a, b) => b.totalPaid - a.totalPaid));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --------------------------------------------------
  📄 Trip 明细列表
  GET /api/report/trips
-------------------------------------------------- */
router.get('/trips', async (req, res) => {
  try {
    const start = new Date(req.query.start || new Date().setHours(0, 0, 0, 0));
    const end = new Date(req.query.end || new Date());

    const trips = await Trip.find({ createdAt: { $gte: start, $lte: end } });

    const result = trips.map(t => ({
      tripId: t._id,
      clientNIF: t.clientNIF,
      value: t.price,
      driverId: t.driverName,
      createdAt: t.createdAt
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --------------------------------------------------
  📈 总体财务统计
  GET /api/report/summary
-------------------------------------------------- */
router.get('/summary', async (req, res) => {
  try {
    const start = req.query.start ? new Date(req.query.start) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = req.query.end ? new Date(req.query.end) : new Date();
    end.setHours(23, 59, 59, 999);

    const trips = await Trip.find({ createdAt: { $gte: start, $lte: end } });

    const totalAmount = trips.reduce((sum, t) => sum + (t.price || 0), 0);
    const totalTrips = trips.length;
    const uniqueClients = new Set(trips.map(t => t.clientNIF));
    const totalClients = uniqueClients.size;

    res.json({ totalAmount, totalTrips, totalClients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


// 🚗 获取单个司机的所有旅程（按开始时间降序）
router.get('/driver-details', async (req, res) => {
    try {
      const name = req.query.driverName;
      const start = new Date(req.query.start);
      const end = new Date(req.query.end);
      end.setHours(23, 59, 59, 999);
  
      const trips = await Trip.find({
        driverName: name,
        startTime: { $gte: start, $lte: end }
      }).sort({ startTime: -1 });
  
      res.json(trips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // 🚖 获取单辆出租车的所有旅程（按开始时间降序）
  router.get('/taxi-details', async (req, res) => {
    try {
      const plate = req.query.vehiclePlate;
      const start = new Date(req.query.start);
      const end = new Date(req.query.end);
      end.setHours(23, 59, 59, 999);
  
      const trips = await Trip.find({
        vehiclePlate: plate,
        startTime: { $gte: start, $lte: end }
      }).sort({ startTime: -1 });
  
      res.json(trips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  