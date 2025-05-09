/**
 * 📄 Report Routes
 * 
 * 本文件定义统计模块 (Report) 相关的 REST API 接口，
 * 用于生成司机、出租车、客户、旅程等多维度的统计信息。
 * 
 * 对应数据库模型: Trip
 * 
 * 路由列表：
 * - GET /api/report/overview         ➔ 获取总览统计（总旅程数 / 总小时数 / 总公里数）
 * - GET /api/report/drivers          ➔ 按司机统计小时数和公里数
 * - GET /api/report/taxis            ➔ 按出租车统计小时数和公里数
 * - GET /api/report/customers        ➔ 客户总支付金额统计
 * - GET /api/report/trips            ➔ 获取旅程明细列表（按创建时间）
 * - GET /api/report/summary          ➔ 财务总览统计（总金额 / 客户数）
 * - GET /api/report/driver-details   ➔ 获取指定司机的旅程列表（按开始时间）
 * - GET /api/report/taxi-details     ➔ 获取指定出租车的旅程列表（按开始时间）
 * - GET /api/report/customer-details ➔ 获取指定客户的旅程列表（按创建时间）
 */

// 📦 引入模块
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
    const start = req.query.start ? new Date(req.query.start) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = req.query.end ? new Date(req.query.end) : new Date();
    end.setHours(23, 59, 59, 999);

    const trips = await Trip.find({ createdAt: { $gte: start, $lte: end } });

    const map = new Map();
    for (const t of trips) {
      const key = t.clientNIF;
      const value = t.price || 0;

      if (!map.has(key)) {
        map.set(key, {
          clientNIF: key,
          clientName: t.clientName?.trim() || key,
          totalPaid: 0,
          tripCount: 0
        });
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
  📄 Trip 明细列表 (重要)
  GET /api/report/trips
-------------------------------------------------- */
router.get('/trips', async (req, res) => {
  try {
    const start = new Date(req.query.start || new Date().setHours(0, 0, 0, 0));
    const end = new Date(req.query.end || new Date());
    end.setHours(23, 59, 59, 999);

    // 🚀 改这里：直接返回完整 Trip, 不再 map 裁剪！
    const trips = await Trip.find({ createdAt: { $gte: start, $lte: end } }).sort({ createdAt: -1 });

    res.json(trips);

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

/* --------------------------------------------------
  🚗 获取单个司机的所有旅程
  GET /api/report/driver-details
-------------------------------------------------- */
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

/* --------------------------------------------------
  🚖 获取单辆出租车的所有旅程
  GET /api/report/taxi-details
-------------------------------------------------- */
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

/* --------------------------------------------------
  📄 查询某个客户的所有trip (根据 createdAt)
  GET /api/report/customer-details
-------------------------------------------------- */
router.get('/customer-details', async (req, res) => {
    try {
      const nif = req.query.clientNIF;
      const start = new Date(req.query.start);
      const end = new Date(req.query.end);
      end.setHours(23, 59, 59, 999);
  
      const trips = await Trip.find({
        clientNIF: nif,
        createdAt: { $gte: start, $lte: end }
      }).sort({ createdAt: -1 });
  
      res.json(trips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;

  