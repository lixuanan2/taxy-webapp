const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Trip = require('../models/Trip'); // 引入 Trip 模型

// 创建发票
// 后端：创建发票时确保发票编号自增
router.post('/', async (req, res) => {
    try {
      const { tripId, clientNIF, total, driverName } = req.body;
  
      // 查重：不能重复开票
      const existing = await Invoice.findOne({ tripId });
      if (existing) {
        return res.status(400).json({ error: 'Já existe fatura para esta viagem.' });
      }
  
      const count = await Invoice.countDocuments({ driverName });
      const invoice = new Invoice({
        tripId,
        clientNIF,
        total,
        driverName,
        sequenceNumber: count + 1,
        invoiceNumber: `INV-${driverName}-${count + 1}`  // 发票编号，格式化为 INV-司机名-自增序号
      });
  
      await invoice.save();
  
      // 更新 trip 的 invoiceId 字段
      await Trip.findByIdAndUpdate(tripId, {
        invoiceId: invoice._id
      });
  
      res.status(201).json(invoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// 获取所有发票（按日期倒序）
router.get('/', async (req, res) => {
  try {
    const driverName = req.query.driverName;
    const filter = driverName ? { driverName } : {};
    const invoices = await Invoice.find(filter).sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 后端 API 路由
router.get('/:id', async (req, res) => {
    try {
      const invoice = await Invoice.findById(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: 'Fatura não encontrada.' });
      }
      res.json(invoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
