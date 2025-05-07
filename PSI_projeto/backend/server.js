/**
 * 📄 Main Server File
 * 
 * 本文件是整个应用的入口，配置并启动 Express 服务器，
 * 连接 MongoDB, 注册所有模块路由。
 */

// 📦 引入模块
const express = require('express');      // Express框架
const mongoose = require('mongoose');    // Mongoose, 用于连接MongoDB
const cors = require('cors');             // CORS中间件, 允许跨域请求
require('dotenv').config();               // dotenv, 用于读取.env文件的环境变量

const app = express();
const PORT = 3000;

// 🛡️ 中间件
app.use(cors());                         // 允许所有跨域请求
app.use(express.json());                 // 允许处理JSON格式的req.body

// 🔗 连接MongoDB(本地数据库 taxiDB, 默认端口27017)
mongoose.connect("mongodb://127.0.0.1:27017/taxiDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* 📚 路由模块注册 */

// 🚕 Taxi相关路由 (User Story 1, 10)
// - Registar, listar, editar, remover táxis
const taxiRoutes = require('./routes/taxi.routes');
app.use('/api/taxis', taxiRoutes);

// 👨‍✈️ Driver相关路由 (User Story 2, 11)
// - Registar, listar, editar, remover motoristas
const driverRoutes = require('./routes/driver.routes');
app.use('/api/drivers', driverRoutes);

// 💰 Price相关路由 (User Story 3)
// - Definir preço por minuto
const priceRoutes = require('./routes/price.routes');
app.use('/api/prices', priceRoutes);

// 🕑 Turno相关路由 (User Story 5)
// - Requisitar táxi para um turno
const turnRoutes = require('./routes/turn.routes');
app.use('/api/turns', turnRoutes);

// 📍 Ride Request (Customer叫车请求) (User Story 6)
// - Cliente pede táxi
const rideRequestRoutes = require('./routes/rideRequest.routes');
app.use('/api/request', rideRequestRoutes);

// 🚖 Trip相关路由 (User Story 8)
// - Motorista regista viagem
const tripRoutes = require('./routes/trip.routes');
app.use('/api/trip', tripRoutes);

// 📊 Report相关路由 (User Story 12, 13)
// - Estatísticas de viagens, motoristas, clientes
const reportRoutes = require('./routes/report.routes');
app.use('/api/report', reportRoutes);

// 🧾 Invoice发票相关路由 (User Story 9)
// - Motorista emite fatura
const invoiceRoutes = require('./routes/invoice.routes');
app.use('/api/invoices', invoiceRoutes);

// 🏡 Código Postal服务 (User Story 2辅助功能)
// - 自动填充邮政编码对应的城市
const postalCodeRouter = require('./routes/postal_code.routes');
app.use(postalCodeRouter);

/* 🚀 启动服务器 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
