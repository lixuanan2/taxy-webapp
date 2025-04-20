const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Turn = require('../models/Turn');

// POST: register new driver
router.post('/', async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0]; // 获取冲突字段（nif 或 licenseNumber）
      return res.status(400).json({ message: `${field} already exists` });
    }

    res.status(400).json({ message: 'Failed to create driver', error: err });
  }
});


// GET: list drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching drivers' });
  }
});

// DELETE /api/drivers/:nif
router.delete('/:nif', async (req, res) => {
  const nif = req.params.nif;

  try {
    const usedInTurn = await Turn.exists({ driverNif: nif });
    if (usedInTurn) {
      return res.status(400).json({ message: 'Este motorista já foi associado a um turno e não pode ser removido.' });
    }

    const deleted = await Driver.findOneAndDelete({ nif });
    if (!deleted) {
      return res.status(404).json({ message: 'Motorista não encontrado.' });
    }

    res.json({ message: 'Motorista removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover motorista.', error: err.message });
  }
});

// PUT /api/drivers/:nif → 更新 motorista 信息
router.put('/:nif', async (req, res) => {
  const { nif } = req.params;
  const updateData = req.body;

  try {
    const driver = await Driver.findOne({ nif });
    if (!driver) return res.status(404).json({ message: 'Motorista não encontrado.' });

    // 🛡️ 安全校验：是否已经用在 turn 中
    const usedInTurn = await Turn.exists({ driverNif: nif });

    // ❌ 禁止改 NIF / licenseNumber
    if (usedInTurn) {
      if (updateData.nif && updateData.nif !== driver.nif) {
        return res.status(400).json({ message: '❌ NIF não pode ser alterado pois já existe turno associado.' });
      }

      if (updateData.licenseNumber && updateData.licenseNumber !== driver.licenseNumber) {
        return res.status(400).json({ message: '❌ Licença não pode ser alterada pois já existe turno associado.' });
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
    res.status(500).json({ message: 'Erro ao atualizar motorista.', error: err.message });
  }
});


// GET /api/drivers/:nif → 获取特定 driver（编辑用）
router.get('/:nif', async (req, res) => {
  try {
    const driver = await Driver.findOne({ nif: req.params.nif });
    if (!driver) return res.status(404).json({ message: 'Motorista não encontrado.' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar motorista.', error: err.message });
  }
});


module.exports = router;
