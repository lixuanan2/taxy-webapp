const express = require('express');
const router = express.Router();
const RideRequest = require('../models/RideRequest');

// POST /api/request
router.post('/', async (req, res) => {
  try {
    const newRequest = new RideRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest); // 返回请求内容
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/request/:id  →  查询叫车请求状态
router.get('/:id', async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/request/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await RideRequest.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.json({ message: 'Pedido cancelado.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
