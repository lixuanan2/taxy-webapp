// trip.routes.js
// 🚖 Trip 路由模块：用于旅程登记、查询、统计

const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Turn = require('../models/Turn');
const Driver = require('../models/Driver');

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

    // 🚖 自动匹配 Turn，填写车牌
    const matchedTurn = await Turn.findOne({
      driverName: driver,
      startTime: { $lte: newStart },
      endTime: { $gte: newEnd }
    });

    // ✅ 创建新 Trip 记录
    const newTrip = new Trip({
      ...req.body,
      sequenceNumber: sequence,
      vehiclePlate: matchedTurn?.vehiclePlate || ''
    });

    await newTrip.save();
    res.status(201).json(newTrip);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 
❗️之前的设计想法（已废弃）：顺便查 Driver 获取 driverNIF
✅ 当前版本直接前端发送 driverNIF，更简单清晰
*/

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
  📊 获取旅程总统计（默认今天）
  GET /api/trip/stats
-------------------------------------------------- */
router.get('/stats', async (req, res) => {
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
  🚗 按司机统计小时数和公里数
  GET /api/trip/stats/drivers
-------------------------------------------------- */
router.get('/stats/drivers', async (req, res) => {
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

    const result = Array.from(map.values()).sort((a, b) => b.hours - a.hours);
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --------------------------------------------------
  🚖 按出租车统计小时数和公里数
  GET /api/trip/stats/taxis
-------------------------------------------------- */
router.get('/stats/taxis', async (req, res) => {
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

    const result = Array.from(map.values()).sort((a, b) => b.hours - a.hours);
    res.json(result);

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

/* --------------------------------------------------
  🧮 其他统计接口（给 Report 用）
-------------------------------------------------- */
 
/* --------------------------------------------------
  📈 获取每位客户的支付金额和旅程数量
  GET /api/trip/stats/customers
-------------------------------------------------- */
router.get('/stats/customers', async (req, res) => {
  const start = new Date(req.query.start || new Date().setHours(0, 0, 0, 0));
  const end = new Date(req.query.end || new Date());
  end.setHours(23, 59, 59, 999);

  const trips = await Trip.find({
    startTime: { $gte: start, $lte: end }
  });

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

  const result = Array.from(map.values()).sort((a, b) => b.totalPaid - a.totalPaid);
  res.json(result);
});

// ==================================================
// 📄 Trip 明细统计接口
// ==================================================

/* --------------------------------------------------
  📄 获取每一笔 Trip 明细（用于下表）
  GET /api/trip/stats/trips
-------------------------------------------------- */
router.get('/stats/trips', async (req, res) => {
  try {
    const start = new Date(req.query.start || new Date().setHours(0, 0, 0, 0));
    const end = new Date(req.query.end || new Date());

    const trips = await Trip.find({
      createdAt: { $gte: start, $lte: end }
    });

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
  📈 获取整体财务统计（总金额 / 客户数 / 旅程数）
  GET /api/trip/stats/summary
-------------------------------------------------- */
router.get('/stats/summary', async (req, res) => {
  try {
    const start = req.query.start ? new Date(req.query.start) : new Date();
    start.setHours(0, 0, 0, 0);

    const end = req.query.end ? new Date(req.query.end) : new Date();
    end.setHours(23, 59, 59, 999);

    const trips = await Trip.find({
      createdAt: { $gte: start, $lte: end }
    });

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
  📈 获取所有客户总体支付数据
  GET /api/trip/stats/customers/overall
-------------------------------------------------- */
router.get('/stats/customers/overall', async (req, res) => {
  try {
    const start = req.query.start ? new Date(req.query.start) : new Date();
    start.setHours(0, 0, 0, 0);

    const end = req.query.end ? new Date(req.query.end) : new Date();
    end.setHours(23, 59, 59, 999);

    const trips = await Trip.find({
      createdAt: { $gte: start, $lte: end }
    });

    const totalAmount = trips.reduce((sum, t) => sum + (t.price || 0), 0);
    const totalTrips = trips.length;
    const uniqueClients = new Set(trips.map(t => t.clientNIF));
    const totalClients = uniqueClients.size;

    res.json({ totalAmount, totalTrips, totalClients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================================================
// 📈 Trip 总体财务统计接口
// ==================================================

/* --------------------------------------------------
  📋 获取单个客户的旅程列表（按创建时间降序）
  GET /api/trip/stats/customer/:nif
-------------------------------------------------- */
router.get('/stats/customer/:nif', async (req, res) => {
  try {
    const nif = req.params.nif;
    const start = req.query.start ? new Date(req.query.start) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = req.query.end ? new Date(req.query.end) : new Date();
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

/* --------------------------------------------------
  🚗 获取单个司机的所有旅程（按开始时间降序）
  GET /api/trip/details/driver
-------------------------------------------------- */
router.get('/details/driver', async (req, res) => {
  try {
    const name = req.query.driverName;
    const start = req.query.start ? new Date(req.query.start) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = req.query.end ? new Date(req.query.end) : new Date();
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
  🚖 获取单辆出租车的所有旅程（按开始时间降序）
  GET /api/trip/details/taxi
-------------------------------------------------- */
router.get('/details/taxi', async (req, res) => {
  try {
    const plate = req.query.vehiclePlate;
    const start = req.query.start ? new Date(req.query.start) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = req.query.end ? new Date(req.query.end) : new Date();
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




module.exports = router;
