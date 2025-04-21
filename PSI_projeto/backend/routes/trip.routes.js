const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Turn = require('../models/Turn');
const Driver = require('../models/Driver');


// POST /api/trip → 注册新旅程
/** 
router.post('/', async (req, res) => {
  try {
    const driver = req.body.driverName;
    const newStart = new Date(req.body.startTime);
    const newEnd = new Date(req.body.endTime);

    // ✅ 校验时间
    if (newStart >= newEnd) {
      return res.status(400).json({ error: 'Hora de início deve ser anterior à de fim.' });
    }

    // ✅ 查重
    const overlap = await Trip.findOne({
      driverName: driver,
      $or: [
        { startTime: { $lt: newEnd }, endTime: { $gt: newStart } }
      ]
    });
    if (overlap) {
      return res.status(400).json({ error: 'Já existe uma viagem neste horário.' });
    }

    // ✅ 获取序号
    const tripCount = await Trip.countDocuments({ driverName: driver });
    const sequence = tripCount + 1;

    // ✅ 查找该司机此时间段是否有 Turn
    const matchedTurn = await Turn.findOne({
      driverName: driver,
      startTime: { $lte: newStart },
      endTime: { $gte: newEnd }
    });

    const newTrip = new Trip({
      ...req.body,
      sequenceNumber: sequence,
      vehiclePlate: matchedTurn?.vehiclePlate || '' // ✅ 自动填写车牌
    });

    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

// POST /api/trip → 注册新旅程
router.post('/', async (req, res) => {
  try {
    const driverName = req.body.driverName;
    const newStart = new Date(req.body.startTime);
    const newEnd = new Date(req.body.endTime);

    if (newStart >= newEnd) {
      return res.status(400).json({ error: 'Hora de início deve ser anterior à de fim.' });
    }

    const overlap = await Trip.findOne({
      driverName,
      $or: [
        { startTime: { $lt: newEnd }, endTime: { $gt: newStart } }
      ]
    });
    if (overlap) {
      return res.status(400).json({ error: 'Já existe uma viagem neste horário.' });
    }

    const tripCount = await Trip.countDocuments({ driverName });
    const sequence = tripCount + 1;

    // ✅ 查询 Driver 表获取 NIF
    const driverDoc = await Driver.findOne({ name: driverName });
    const driverNIF = driverDoc?.nif;

    // ✅ 查询 Turn 表获取车牌（匹配 driverNIF + 时间）
    const matchedTurn = await Turn.findOne({
      driverNIF,
      startTime: { $lte: newStart },
      endTime: { $gte: newEnd }
    });

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


// GET /api/trip → 获取所有 trip 记录
router.get('/', async (req, res) => {
  try {
    const driver = req.query.driverName;
    const start = req.query.start ? new Date(req.query.start) : null;
    const end = req.query.end ? new Date(req.query.end) : null;

    const filter = {};

    if (driver) filter.driverName = driver;
    if (start && end) {
      filter.startTime = { $gte: start, $lte: end };
    }

    const trips = await Trip.find(filter).sort({ startTime: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  
// 获取 trip 总统计（默认今天）
router.get('/stats', async (req, res) => {
  const start = req.query.start ? new Date(req.query.start) : new Date();
  start.setHours(0, 0, 0, 0);

  const end = req.query.end ? new Date(req.query.end) : new Date();
  end.setHours(23, 59, 59, 999);

  const trips = await Trip.find({
    startTime: { $gte: start, $lte: end }
  });

  const totalTrips = trips.length;
  const totalHours = trips.reduce((sum, t) => {
    const hours = (new Date(t.endTime) - new Date(t.startTime)) / 3600000;
    return sum + hours;
  }, 0);
  const totalKm = trips.reduce((sum, t) => sum + (t.kmTraveled || 0), 0);

  res.json({ totalTrips, totalHours, totalKm });
});


// GET /api/trip/stats/drivers → 每位司机的小时数或公里数
router.get('/stats/drivers', async (req, res) => {
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
});

// GET /api/trip/stats/taxis → 每辆 taxi 的小时数或公里数
router.get('/stats/taxis', async (req, res) => {
  const start = new Date(req.query.start || new Date().setHours(0, 0, 0, 0));
  const end = new Date(req.query.end || new Date());

  const trips = await Trip.find({
    startTime: { $gte: start, $lte: end },
    vehiclePlate: { $ne: '' } // 排除没填 plate 的情况
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
});

// GET /api/trip/stats/driver/:name → 查看某司机的所有旅程（降序）
router.get('/stats/driver/:name', async (req, res) => {
  const name = req.params.name;
  const start = new Date(req.query.start || new Date().setHours(0, 0, 0, 0));
  const end = new Date(req.query.end || new Date());

  const trips = await Trip.find({
    driverName: name,
    startTime: { $gte: start, $lte: end }
  }).sort({ startTime: -1 }); // 最新在前

  res.json(trips);
});

// GET /api/trip/stats/taxi/:plate → 查看某辆车的所有旅程（降序）
router.get('/stats/taxi/:plate', async (req, res) => {
  const plate = req.params.plate;
  const start = new Date(req.query.start || new Date().setHours(0, 0, 0, 0));
  const end = new Date(req.query.end || new Date());

  const trips = await Trip.find({
    vehiclePlate: plate,
    startTime: { $gte: start, $lte: end }
  }).sort({ startTime: -1 });

  res.json(trips);
});

router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Viagem não encontrada.' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar viagem.', error: err.message });
  }
});

// GET /api/trip/stats/customers → 每位客户的支付金额和旅程数量
router.get('/stats/customers', async (req, res) => {
  try {
    const start = new Date(req.query.start || new Date().setHours(0, 0, 0, 0));
    const end = new Date(req.query.end || new Date());

    const trips = await Trip.find({
      createdAt: { $gte: start, $lte: end }
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trip/stats/trips → 每一笔 Trip 明细（用于下表）
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


// GET /api/trip/stats → 总金额 / 总客户数 / 总旅程数
router.get('/stats', async (req, res) => {
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

// GET /api/trip/stats/customers/overall
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

// GET /api/trip/stats/customer/:nif → 某客户的所有旅程（按时间降序）
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

// GET /api/trip/details/driver → 查询某司机的旅程（按 startTime 降序）
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

// GET /api/trip/details/taxi → 某辆出租车的旅程（按 startTime 降序）
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
