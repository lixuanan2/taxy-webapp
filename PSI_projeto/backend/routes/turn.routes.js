/**
 * 🛣️ Turn Routes
 * 
 * 本模块处理 Turn(司机班次)相关 API:
 * - 创建新 Turn
 * - 查询司机所有 Turn
 * - 查询特定时间段可用出租车
 */

const express = require('express');
const router = express.Router();

// 📦 模型导入
const Turn = require('../models/Turn');
const Taxi = require('../models/Taxi');

/**
 * 🚗 POST /api/turns
 * 创建新的 Turn(班次)
 */
router.post('/', async (req, res) => {
  const { driverNIF, startTime, endTime } = req.body;

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // ⏳ 校验：班次时长不能超过 8 小时
    const duration = (end - start) / (1000 * 60 * 60);
    if (duration > 8) {
      return res.status(400).json({ message: 'Turn cannot exceed 8 hours.' });
    }

    // 🕓 校验：开始时间必须在当前时间之后
    if (start < new Date()) {
      return res.status(400).json({ message: 'Turn must start in the future.' });
    }

    // 🔍 校验：同一司机不能有重叠的 Turn
    const overlappingTurn = await Turn.findOne({
      driverNIF,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (overlappingTurn) {
      return res.status(400).json({ message: 'Driver already has a turn during this period.' });
    }

    // ✅ 保存新 Turn
    const newTurn = new Turn(req.body);
    const saved = await newTurn.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * 🧑‍✈️ GET /api/turns/driver/:nif
 * 根据司机 NIF 查询所有 Turn(按起始时间升序)
 */
router.get('/driver/:nif', async (req, res) => {
  try {
    const turns = await Turn.find({ driverNIF: req.params.nif }).sort({ startTime: 1 });
    res.json(turns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🚕 GET /api/turns/available
 * 查询指定时间段内可用的出租车(未被分配 Turn)
 */
router.get('/available', async (req, res) => {
  const { start, end } = req.query;

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // 🔍 查找所有冲突的 Turn(已被占用的 taxi)
    const activeTurns = await Turn.find({
      startTime: { $lt: endDate },
      endTime: { $gt: startDate }
    });

    const busyPlates = activeTurns.map(t => t.taxiPlate);

    // 🚖 查询未占用的 Taxi
    const availableTaxis = await Taxi.find({ plate: { $nin: busyPlates } });

    res.json(availableTaxis);
  } catch (err) {
    console.error('❌ Error in /available:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🔄 GET /api/turns/active/:nif
 * 获取当前时间内有效的 Turn (active turn)
 */
router.get('/active/:nif', async (req, res) => {
  try {
    const now = new Date();
    const active = await Turn.findOne({
      driverNIF: req.params.nif,
      startTime: { $lte: now },
      endTime: { $gte: now }
    });
    res.json(active || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
