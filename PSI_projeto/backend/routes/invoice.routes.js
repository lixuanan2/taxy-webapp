/**
 * 📄 Invoice Routes
 * 
 * 本文件定义发票 (Invoice) 模块相关的 REST API 接口，
 * 负责旅程结束后发票的创建、查询和详情查看。
 * 
 * 对应数据库模型: Invoice
 * 
 * 路由列表：
 * - POST   /api/invoices         ➔ 创建新发票
 * - GET    /api/invoices         ➔ 获取所有发票（支持按司机名筛选）
 * - GET    /api/invoices/:id     ➔ 获取指定发票详情
 */

// 📦 引入模块
const express = require('express');
const router = express.Router();

// 🧩 导入模型
const Invoice = require('../models/Invoice');
const Trip = require('../models/Trip');

/**
 * 🧾 POST /api/invoices
 * 创建一张新的发票
 * 
 * 要求：
 * - 同一旅程 tripId 不能重复开票
 * - 同一司机 driverName 下 sequenceNumber 自增
 * - 同时更新 Trip 的 invoiceId 字段
 */
router.post('/', async (req, res) => {
  try {
    const { tripId, clientNIF, total, driverName } = req.body;

    // 🔍 查重：不能为同一旅程重复开票
    const existing = await Invoice.findOne({ tripId });
    if (existing) {
      return res.status(400).json({ message: 'An invoice already exists for this trip.' });
    }

    // 📈 统计该司机已有发票数，生成新的 sequenceNumber
    const count = await Invoice.countDocuments({ driverName });

    // 🧾 创建新发票对象
    const invoice = new Invoice({
      tripId,
      clientNIF,
      total,
      driverName,
      sequenceNumber: count + 1,
      invoiceNumber: `INV-${driverName}-${count + 1}` // 格式 INV-driverName-sequence
    });

    // 💾 保存发票
    await invoice.save();

    // 🔄 更新 Trip 文档，写入对应的 invoiceId
    await Trip.findByIdAndUpdate(tripId, {
      invoiceId: invoice._id
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Error creating invoice.', error: err.message });
  }
});

/**
 * 🧾 GET /api/invoices
 * 获取所有发票（可按司机名 driverName 过滤）
 * 默认按发票日期 date 倒序排列
 */
router.get('/', async (req, res) => {
  try {
    const driverName = req.query.driverName;
    const filter = driverName ? { driverName } : {};

    const invoices = await Invoice.find(filter).sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoices.', error: err.message });
  }
});

/**
 * 🧾 GET /api/invoices/:id
 * 根据发票 id 获取单张发票详情
 */
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoice.', error: err.message });
  }
});

module.exports = router;
