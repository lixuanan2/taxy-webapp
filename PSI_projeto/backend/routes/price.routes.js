/**
 * 📄 Price Routes
 * 
 * 本文件定义价格 (Price) 模块相关的 REST API 接口，
 * 负责出租车服务的价格配置保存、最新价格查询和历史价格查询。
 * 
 * 对应数据库模型: Price
 * 
 * 路由列表：
 * - POST   /api/prices         ➔ 创建新的价格配置
 * - GET    /api/prices/latest  ➔ 获取最新价格配置
 * - GET    /api/prices/all     ➔ 获取所有历史价格配置
 */

// 📦 引入模块
const express = require('express');
const router = express.Router();

// 🧩 导入模型
const Price = require('../models/Price');

/**
 * 💰 POST /api/prices
 * 新增一条价格配置 (Create new price config)
 */
router.post('/', async (req, res) => {
  try {
    const newPrice = new Price(req.body);
    const saved = await newPrice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create price.', error: err.message });
  }
});

/**
 * 💰 GET /api/prices/latest
 * 获取最新一条价格配置 (Get latest price config)
 */
router.get('/latest', async (req, res) => {
  try {
    const latest = await Price.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch latest price.', error: err.message });
  }
});

/**
 * 💰 GET /api/prices/all
 * 获取所有历史价格配置 (Get all price configs)
 */
router.get('/all', async (req, res) => {
  try {
    const allPrices = await Price.find().sort({ createdAt: -1 });
    res.json(allPrices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch price history.', error: err.message });
  }
});

module.exports = router;