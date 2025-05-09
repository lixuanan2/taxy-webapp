/**
 * 📄 Request Routes
 * 
 * 本文件定义了乘客叫车请求 (RideRequest) 相关的 REST API 接口，
 * 支持创建请求、查询状态、取消请求，以及司机接单、拒单、完成行程等操作。
 * 
 * 对应数据库模型: RideRequest
 * 
 * 路由列表：
 * 
 * 🚖 Story 6 - Request Taxi
 * - POST   /api/request           ➔ 创建新的叫车请求
 * - GET    /api/request/history   ➔ 获取所有叫车历史
 * - GET    /api/request/:id       ➔ 查询单个叫车请求状态
 * - DELETE /api/request/:id       ➔ 已发生更改，但是保留
 * 
 * 🚖 Story 7 - Driver Accept/Reject Requests
 * - GET    /api/request?status=pending ➔ 根据状态筛选请求(例如 pending)
 * - PATCH  /api/request/:id/accept     ➔ 接受叫车请求
 * - PATCH  /api/request/:id/reject     ➔ 拒绝叫车请求
 * - PATCH  /api/request/:id/cancel     ➔ 取消叫车请求
 * 
 * 🚖 Story 8 - Confirmations and Finishing Rides
 * - GET    /api/request/accepted/:driverNIF ➔ 查询指定司机接受的请求
 * - PATCH  /api/request/:id/done            ➔ 标记叫车请求为完成
 * - PATCH  /api/request/:id/confirm         ➔ 客户确认司机提议
 */

const express = require('express');
const router = express.Router();
const RideRequest = require('../models/RideRequest');

// ================================================== //
// 🚖 Story 6 - Request a Taxi (Create, Query, Cancel)
// ================================================== //

// POST /api/request - Create a new ride request
router.post('/', async (req, res) => {
  try {
    const newRequest = new RideRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/request/history - Get all ride requests (for history)
router.get('/history', async (req, res) => {
  try {
    const requests = await RideRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/request/:id - Get ride request status by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await RideRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/request/:id - 已发生更改，但是保留
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await RideRequest.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    res.json({ message: 'Request canceled successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================================================== //
// 🚖 Story 7 - Driver Accept/Reject Requests
// ================================================== //

// GET /api/request?status=pending&driverLat=38.7&driverLon=-9.1 - Get requests by status (新增了Haversine 计算距离并排序)
router.get('/', async (req, res) => {
  try {
    const { status, driverLat, driverLon } = req.query;
    const filter = status ? { status } : {};
    const all = await RideRequest.find(filter);

    let requests = all;

    if (driverLat && driverLon) {
      const lat1 = parseFloat(driverLat);
      const lon1 = parseFloat(driverLon);

      requests = all.map(r => {
        const lat2 = r.currentLat;
        const lon2 = r.currentLon;

        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return { ...r._doc, distance };
      });

      requests.sort((a, b) => a.distance - b.distance);
    }

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/request/:id/accept - Accept a ride request
router.patch('/:id/accept', async (req, res) => {
  try {
    const request = await RideRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'accepted',
        driverNIF: req.body.driverNIF
      },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/request/:id/reject - Reject a ride request
router.patch('/:id/reject', async (req, res) => {
  try {
    const request = await RideRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/request/:id/cancel - Cancel (mark as canceled) a ride request
router.patch('/:id/cancel', async (req, res) => {
  try {
    const canceledRequest = await RideRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'canceled' },
      { new: true }
    );
    if (!canceledRequest) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    res.json(canceledRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ================================================== //
// 🚖 Story 8 - Confirmations and Finishing Rides
// ================================================== //

// GET /api/request/accepted/:driverNIF - Get accepted request by driverNIF
router.get('/accepted/:driverNIF', async (req, res) => {
  try {
    const accepted = await RideRequest.findOne({
      status: 'accepted',
      driverNIF: req.params.driverNIF
    });
    res.json(accepted || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/request/:id/done - Mark ride as done
router.patch('/:id/done', async (req, res) => {
  try {
    const updated = await RideRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'done' },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/request/:id/confirm - Client confirms driver proposal
router.patch('/:id/confirm', async (req, res) => {
  try {
    const request = await RideRequest.findByIdAndUpdate(
      req.params.id,
      { confirmedByClient: true },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
