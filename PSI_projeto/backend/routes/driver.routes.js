/**
 * 📄 Driver Routes
 * 
 * 本文件定义司机 (Driver) 模块相关的 REST API 接口，
 * 负责司机的注册、查询、更新和删除操作。
 * 
 * 对应数据库模型: Driver
 * 
 * 路由列表：
 * - POST   /api/drivers          ➔ 创建新司机
 * - GET    /api/drivers          ➔ 获取所有司机
 * - GET    /api/drivers/:nif     ➔ 获取指定 NIF 的司机
 * - DELETE /api/drivers/:nif     ➔ 删除指定司机 (需校验是否关联 turn)
 * - PUT    /api/drivers/:nif     ➔ 更新指定司机 (校验 shift 绑定)
 */

// 📦 引入模块
const express = require('express');
const router = express.Router();

// 🧩 导入模型
const Driver = require('../models/Driver');
const Turn = require('../models/Turn');

/**
 * 🧑 POST /api/drivers
 * 注册新司机 (Register new driver)
 */
router.post('/', async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0]; // 捕获冲突字段(nif 或 licenseNumber)
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(400).json({ message: 'Failed to create driver', error: err });
  }
});

/**
 * 🧑 GET /api/drivers
 * 获取所有司机列表 (List all drivers)
 */
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching drivers' });
  }
});

/**
 * 🧑 GET /api/drivers/:nif
 * 根据 NIF 获取特定司机信息 (Get driver by NIF)
 */
router.get('/:nif', async (req, res) => {
  try {
    const driver = await Driver.findOne({ nif: req.params.nif });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching driver', error: err.message });
  }
});

/**
 * 🧑 DELETE /api/drivers/:nif
 * 删除指定 NIF 的司机 (Delete driver)
 * 注意 Story 11.b 要求：如果关联了 turn，禁止删除
 */
router.delete('/:nif', async (req, res) => {
  const nif = req.params.nif;

  try {
    const usedInTurn = await Turn.exists({ driverNif: nif });
    if (usedInTurn) {
      return res.status(400).json({ message: 'Driver has been associated with a shift and cannot be deleted.' });
    }

    const deleted = await Driver.findOneAndDelete({ nif });
    if (!deleted) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    res.json({ message: 'Driver deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting driver.', error: err.message });
  }
});

/**
 * 🧑 PUT /api/drivers/:nif
 * 更新指定 NIF 的司机信息 (Update driver)
 * 注意：如果已有 shift 记录，禁止修改 NIF 和 licenseNumber
 */
router.put('/:nif', async (req, res) => {
  const { nif } = req.params;
  const updateData = req.body;

  try {
    const driver = await Driver.findOne({ nif });
    if (!driver) return res.status(404).json({ message: 'Driver not found.' });

    const usedInTurn = await Turn.exists({ driverNif: nif });

    if (usedInTurn) {
      if (updateData.nif && updateData.nif !== driver.nif) {
        return res.status(400).json({ message: '❌ NIF cannot be changed because it is associated with shifts.' });
      }
      if (updateData.licenseNumber && updateData.licenseNumber !== driver.licenseNumber) {
        return res.status(400).json({ message: '❌ License number cannot be changed because it is associated with shifts.' });
      }
    }

    updateData.updatedAt = new Date();

    const updated = await Driver.findOneAndUpdate(
      { nif },
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating driver.', error: err.message });
  }
});

module.exports = router;
