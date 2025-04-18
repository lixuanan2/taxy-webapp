const express = require('express');
const router = express.Router();
const RideRequest = require('../models/RideRequest');

// POST /api/request   story 6
router.post('/', async (req, res) => {
  try {
    const newRequest = new RideRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest); // 返回请求内容
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/request/:id  →  查询叫车请求状态  story 6
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

// DELETE /api/request/:id  story 6
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

// GET /api/request?status=pending    story 7
router.get('/', async (req, res) => {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {}; // 支持带或不带 status 查询
    const requests = await RideRequest.find(filter);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PATCH /api/request/:id/accept       story 7
router.patch('/:id/accept', async (req, res) => {
  try {
    const request = await RideRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'accepted',
        driverId: req.body.driverId  // 前端传入司机名
      },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PATCH /api/request/:id/reject      story 7
router.patch('/:id/reject', async (req, res) => {
  try {
    const request = await RideRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
