# 🚖 Taxi WebApp (PSI Project)

本项目为 FCUL 信息工程专业 PSI 科目的课程作业，目标是开发一个面向司机、客户和管理者的出租车管理系统。

---

## 📦 技术栈 & 环境

- **前端框架**：Angular 16 + Angular Material + Bootstrap
- **地图服务**：Leaflet.js
- **后端框架**：Node.js + Express
- **数据库**：MongoDB + Mongoose ODM

---

## 📁 项目结构

```
/taxy-webapp
├── frontend/taxi-manager       # Angular 前端项目
└── backend                     # Node.js 后端服务
```

---

## ⚙️ 安装和运行（Setup & Run）

### 1. 克隆项目
```bash
git clone https://github.com/lixuanan2/taxy-webapp.git
```

### 2. 安装前端依赖
```bash
cd frontend/taxi-manager
npm install
```

### 3. 安装后端依赖
```bash
cd ../../backend
npm install
```

### 4. 运行前端
```bash
cd ../frontend/taxi-manager
ng serve
然后在浏览器中访问 http://localhost:4200，你将看到前端应用的界面
```
访问：`http://localhost:4200`

### 5. 运行后端
```bash
cd ../../backend
node server.js
```
（确保 MongoDB 服务已开启）

---

## 💡 特性功能（Features）

### 管理端（Manager）
- 出租车管理（创建、编辑、列表）
- 司机管理（注册、编辑、列表）
- 报价策略管理（基本费用、夜间加成）
- 报告统计（每个司机/车辆/客户的总时长、距离、金额）

### 司机端（Driver）
- 登录并切换角色
- 创建工作班次（Turn）
- 接单/拒单（Request）
- 注册旅程（Trip）
- 自动计算价格 & 距离
- 发票生成与历史查看

### 客户端（Customer）
- 请求叫车（支持地图点选）
- 查看司机接单弹窗确认
- 查看历史请求记录（状态：pending/accepted/rejected）

---

## 🧭 依赖说明

### 前端依赖
```json
@angular/core@16
@angular/material@16
leaflet@1.9.4
bootstrap@5.3.5
```
详见 `package.json` 和 `angular.json` 中的 styles 配置。

### 后端依赖
```json
express, mongoose, cors, dotenv, nodemon
```
详见 `backend/package.json`

---

## 📝 注意事项

- Leaflet 地图使用需联网，地图样式来自 CDN。
- Bootstrap 与 Material 样式混用时有冲突，已通过自定义 SCSS 做隔离。
- 本项目主要优化桌面端，移动端暂未完全适配。

---

## 💚 贡献与未来

本仓库为 PSI v1 版本实现，后续将通过 `v2` 分支进行逻辑优化、接口抽象与 UI 增强。

欢迎 PR、Fork 与建议。

---

## 📮 联系方式

开发者：[@lixuanan2](https://github.com/lixuanan2)

感谢查看！祝你使用愉快 🚕✨

