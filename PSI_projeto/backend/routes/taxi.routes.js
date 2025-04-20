const express = require('express');     // express路由模块
const router = express.Router();
const Taxi = require('../models/Taxi');
const Turn = require('../models/Turn'); // 引入turn
const Trip = require('../models/Trip'); // 引入trip

// POST: 添加一个新的taxi
router.post('/', async (req, res) => {
  try {
    const newTaxi = new Taxi(req.body);       // 创建一个新的taxi实例
    const savedTaxi = await newTaxi.save();   // 保存至MongoDB
    res.status(201).json(savedTaxi);          // 返回新创建的对象
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Duplicate plate', error: err.message });
    } else {
      res.status(500).json({ message: 'Error creating taxi', error: err.message });
    }
  }
});

// GET: 列出所有的taxi
router.get('/', async (req, res) => {
  try {
    // Taxi.find()对应(SELECT * FROM taxi)
    const taxis = await Taxi.find().sort({ createdAt: -1 }); // 最近的排在最前
    res.json(taxis);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching taxis' });
  }
});

// DELETE: 删除一个 taxi（Story 10.b 条件校验）
router.delete('/:plate', async (req, res) => {
  try {
    const plate = req.params.plate;

    // 查询是否存在关联该车牌的 turn
    const hasUsed = await Turn.exists({ taxiPlate: plate });

    if (hasUsed) {
      return res.status(400).json({ message: 'Este táxi já foi utilizado em um turno e não pode ser removido.' });
    }

    // 如果没用过，允许删除
    const deleted = await Taxi.findOneAndDelete({ plate });

    if (!deleted) {
      return res.status(404).json({ message: 'Táxi não encontrado.' });
    }

    res.json({ message: 'Táxi removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover táxi.', error: err.message });
  }
});

// GET /api/taxis/:plate
router.get('/:plate', async (req, res) => {
  try {
    const taxi = await Taxi.findOne({ plate: req.params.plate });
    if (!taxi) return res.status(404).json({ message: 'Taxi not found' });
    res.json(taxi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: 更新 taxi 信息
router.put('/:plate', async (req, res) => {
  const { plate } = req.params;
  const updateData = req.body;

  try {
    const taxi = await Taxi.findOne({ plate });
    if (!taxi) return res.status(404).json({ message: 'Táxi não encontrado.' });

    // 🚧 新逻辑：通过 turn 找出用过这辆车的司机，再看司机是否已进行 trip
    const relatedTurns = await Turn.find({ taxiPlate: plate });
    const relatedNifs = relatedTurns.map(t => t.driverNif);

    let usedInTrip = false;
    if (relatedNifs.length > 0) {
      usedInTrip = await Trip.exists({ driverNIF: { $in: relatedNifs } });
    }

    // 🚫 如果想改 comfortLevel，但该 taxi 已用于 trip，就禁止
    if (
      usedInTrip &&
      updateData.comfortLevel &&
      updateData.comfortLevel !== taxi.comfortLevel
    ) {
      return res.status(400).json({
        message: '🚫 O nível de conforto não pode ser alterado porque o táxi já realizou viagens.'
      });
    }

    updateData.updatedAt = new Date();

    const updated = await Taxi.findOneAndUpdate(
      { plate },
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro interno no servidor.', error: err.message });
  }
});


module.exports = router;
