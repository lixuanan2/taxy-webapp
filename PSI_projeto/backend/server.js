const express = require('express');      // Express框架
const mongoose = require('mongoose');    // Mongoose,用于连接 MongoDB
const cors = require('cors');            // CORS中间件,允许跨域请求
require('dotenv').config();              // dotenv,用于读取.env文件的环境变量

const app = express();
const PORT = 3000;

app.use(cors());            // 允许所有跨域请求
app.use(express.json());    // 允许处理JSON格式的req.body

// 连接本地MongoDB taxiDB(默认端口是27017)
mongoose.connect("mongodb://127.0.0.1:27017/taxiDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// 加载taxi相关的路由模块
const taxiRoutes = require('./routes/taxiRoutes');
// 设置路由前缀为/api/taxis
app.use('/api/taxis', taxiRoutes); 

// 启动Express服务器,监听指定端口
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

