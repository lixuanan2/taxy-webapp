/**
 * 📄 Taxi Routes
 * 
 * 本文件定义出租车 (Taxi) 模块相关的 REST API 接口，
 * 负责出租车的注册、查询、更新和删除操作。
 * 
 * 对应数据库模型: Taxi
 * 
 * 路由列表：
 * - POST   /api/taxis           ➔ 创建新出租车
 * - GET    /api/taxis           ➔ 获取所有出租车
 * - GET    /api/taxis/:plate    ➔ 获取指定车牌的出租车
 * - DELETE /api/taxis/:plate    ➔ 删除指定出租车 (需校验是否关联 turn)
 * - PUT    /api/taxis/:plate    ➔ 更新指定出租车 (校验是否已用于 trip)
 */

// 📦 引入模块
const express = require('express');
const router = express.Router();

// 🧩 导入模型
const Taxi = require('../models/Taxi');
const Turn = require('../models/Turn');
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');

/**
 * 🚕 POST /api/taxis
 * 添加一个新的出租车
 */
router.post('/', async (req, res) => {
  try {
    const newTaxi = new Taxi(req.body);
    const savedTaxi = await newTaxi.save();
    res.status(201).json(savedTaxi);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Duplicate plate', error: err.message });
    } else {
      res.status(500).json({ message: 'Error creating taxi', error: err.message });
    }
  }
});

/**
 * 🚕 GET /api/taxis
 * 列出所有出租车，按创建时间倒序排列
 */
router.get('/', async (req, res) => {
  try {
    const taxis = await Taxi.find().sort({ createdAt: -1 });
    res.json(taxis);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching taxis' });
  }
});

/**
 * 🚕 GET /api/taxis/:plate
 * 根据车牌查询单个出租车
 */
router.get('/:plate', async (req, res) => {
  try {
    const taxi = await Taxi.findOne({ plate: req.params.plate });
    if (!taxi) return res.status(404).json({ message: 'Taxi not found' });
    res.json(taxi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🚕 DELETE /api/taxis/:plate
 * 删除指定车牌的出租车
 * 注意 Story 10.b 要求：不能删除已用于 turn 的出租车
 */
router.delete('/:plate', async (req, res) => {
  try {
    const plate = req.params.plate;

    // 🔍 检查是否有 Turn 记录使用了该车牌
    const hasUsed = await Turn.exists({ taxiPlate: plate });

    if (hasUsed) {
      return res.status(400).json({
        message: 'This taxi has been used in a shift and cannot be deleted.'
      });
    }

    // 🗑️ 如果未被使用，执行删除
    const deleted = await Taxi.findOneAndDelete({ plate });

    if (!deleted) {
      return res.status(404).json({ message: 'Taxi not found.' });
    }

    res.json({ message: 'Taxi deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting taxi.', error: err.message });
  }
});

/**
 * 🚕 PUT /api/taxis/:plate
 * 更新指定车牌的出租车信息
 * 特别注意：如果 taxi 已经用于 trip, 不允许修改 comfortLevel
 */
router.put('/:plate', async (req, res) => {
  const { plate } = req.params;
  const updateData = req.body;

  try {
    const taxi = await Taxi.findOne({ plate });
    if (!taxi) return res.status(404).json({ message: 'Taxi not found.' });

    // 🚦 查询与该 taxi 关联的 turn 记录
    const relatedTurns = await Turn.find({ taxiPlate: plate });
    const relatedNifs = relatedTurns.map(t => t.driverNif);

    let usedInTrip = false;

    if (relatedNifs.length > 0) {
      // 👥 查询这些 NIF 对应的 driverName
      const drivers = await Driver.find({ nif: { $in: relatedNifs } });
      const relatedNames = drivers.map(d => d.name);

      // 🚗 查询这些 driverName 是否存在已完成的 trip
      usedInTrip = await Trip.exists({ driverName: { $in: relatedNames } });
    }

    // ❌ 如果已用于 trip，禁止修改 comfortLevel
    if (
      usedInTrip &&
      updateData.comfortLevel &&
      updateData.comfortLevel !== taxi.comfortLevel
    ) {
      return res.status(400).json({
        message: '🚫 Comfort level cannot be changed because the taxi has completed trips.'
      });
    }

    // 📝 正常更新 taxi
    updateData.updatedAt = new Date();

    const updated = await Taxi.findOneAndUpdate(
      { plate },
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
});

module.exports = router;
