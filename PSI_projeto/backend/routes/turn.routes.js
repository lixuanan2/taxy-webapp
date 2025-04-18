const express = require('express');
const router = express.Router();
const Turn = require('../models/Turn');
const Taxi = require('../models/Taxi');

// POST 创建 turn
// POST 创建 turn
router.post('/', async (req, res) => {
  const { driverNif, startTime, endTime } = req.body;

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // 校验：duration ≤ 8小时
    const duration = (end - start) / (1000 * 60 * 60);
    if (duration > 8) {
      return res.status(400).json({ message: 'Turn cannot exceed 8 hours.' });
    }

    // 校验：start > now
    if (start < new Date()) {
      return res.status(400).json({ message: 'Turn must start in the future.' });
    }

    // 校验：同一司机不能有重叠 turn
    const overlappingTurn = await Turn.findOne({
      driverNif,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (overlappingTurn) {
      return res.status(400).json({ message: 'Driver already has a turn during this period.' });
    }

    // 一切通过后保存
    const newTurn = new Turn(req.body);
    const saved = await newTurn.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// GET 获取所有 turn（可根据 driver 筛选）
router.get('/driver/:nif', async (req, res) => {
  try {
    const turns = await Turn.find({ driverNif: req.params.nif }).sort({ startTime: 1 });
    res.json(turns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET 可用的出租车（不冲突）
router.get('/available', async (req, res) => {
  const { start, end } = req.query;

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    console.log('🔍 Received start:', startDate.toISOString());
    console.log('🔍 Received end:', endDate.toISOString());

    const activeTurns = await Turn.find({
      startTime: { $lt: endDate },
      endTime: { $gt: startDate }
    });

    console.log('🔍 Active turns:', activeTurns);

    const busyPlates = activeTurns.map(t => t.taxiPlate);
    const availableTaxis = await Taxi.find({ plate: { $nin: busyPlates } });

    console.log('✅ Available taxis:', availableTaxis);
    res.json(availableTaxis);
  } catch (err) {
    console.error('❌ Error in /available:', err);
    res.status(500).json({ message: err.message });
  }
});

  

module.exports = router;
